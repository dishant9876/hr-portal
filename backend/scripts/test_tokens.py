import json
import urllib.request
import base64
from datetime import datetime, timezone

BASE_URL = 'http://127.0.0.1:8000'
REGISTER_URL = BASE_URL + '/api/auth/register/recruiter/'

payload = {
    "name": "Test Recruiter",
    "email": "test.recruiter@example.com",
    "password": "TestPassword123!",
    "phone_number": "1234567890",
    "company_name": "TestCo",
    "company_address": "123 Test St",
}

def post_json(url, data):
    data_bytes = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=data_bytes, headers={
        'Content-Type': 'application/json'
    })
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)


def decode_jwt(token):
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        payload_b64 = parts[1]
        # Add padding
        padding = '=' * (-len(payload_b64) % 4)
        payload_b64 += padding
        decoded = base64.urlsafe_b64decode(payload_b64.encode('utf-8'))
        return json.loads(decoded)
    except Exception as e:
        return None


def ts_to_dt(ts):
    return datetime.fromtimestamp(ts, tz=timezone.utc)


if __name__ == '__main__':
    print('Registering test recruiter...')
    try:
        resp = post_json(REGISTER_URL, payload)
    except Exception as e:
        print('Request failed:', e)
        raise

    print('Response:')
    print(json.dumps(resp, indent=2))

    access = resp.get('access')
    refresh = resp.get('refresh')

    if access:
        ap = decode_jwt(access)
        if ap and 'exp' in ap:
            print('\nAccess token expiry (UTC):', ts_to_dt(ap['exp']).isoformat())
    if refresh:
        rp = decode_jwt(refresh)
        if rp and 'exp' in rp:
            print('Refresh token expiry (UTC):', ts_to_dt(rp['exp']).isoformat())

    print('\nDone.')
