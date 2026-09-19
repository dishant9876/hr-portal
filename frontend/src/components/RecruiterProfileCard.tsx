"use client";
import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Mail, MapPin, Pencil, Phone, Save, ShieldCheck, UserRound, X } from "lucide-react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function RecruiterProfileCard() {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false), [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null), [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone_number: "", company_name: "", company_address: "" });
  useEffect(() => { api.get("/auth/profile/").then(({ data }) => setFormData({ name: data.name || "", email: data.email || "", phone_number: data.phone_number || "", company_name: data.company_name || "", company_address: data.company_address || "" })).catch(() => setError("Failed to load profile.")); }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleSave = async () => { try { setLoading(true); setError(null); setSuccess(null); const { data } = await api.put("/auth/profile/update/", formData); setUser(data); setSuccess("Profile updated successfully."); setIsEditing(false); } catch { setError("Failed to update profile."); } finally { setLoading(false); } };
  const initials = (formData.company_name || formData.name || "TB").split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  const fields = [
    { key: "name", label: "Contact name", icon: UserRound, type: "text" },
    { key: "email", label: "Work email", icon: Mail, type: "email" },
    { key: "phone_number", label: "Phone number", icon: Phone, type: "tel" },
    { key: "company_name", label: "Company name", icon: Building2, type: "text" },
  ] as const;
  return <section className="profile-designer-card">
    <div className="profile-cover"><span className="profile-cover-ring" /><div className="company-avatar">{initials}</div><div className="profile-identity"><span className="section-kicker">RECRUITER ACCOUNT</span><h1>{formData.company_name || "Your company"}</h1><p>{formData.name || "Complete your recruiter profile"}</p></div><span className="verified-chip"><ShieldCheck size={15} /> Verified workspace</span></div>
    <div className="profile-toolbar"><div><h2>Company profile</h2><p>Keep these details current for candidates viewing your jobs.</p></div>{!isEditing ? <button onClick={() => setIsEditing(true)} className="designer-button"><Pencil size={16} /> Edit profile</button> : <div className="profile-actions"><button onClick={() => setIsEditing(false)} className="ghost-button"><X size={16} /> Cancel</button><button onClick={handleSave} disabled={loading} className="designer-button"><Save size={16} />{loading ? "Saving…" : "Save changes"}</button></div>}</div>
    {error && <div className="profile-message error-message">{error}</div>}{success && <div className="profile-message success-message"><CheckCircle2 size={17} />{success}</div>}
    <div className="profile-fields">{fields.map(({ key, label, icon: Icon, type }) => <label key={key} className="designer-field"><span><Icon size={16} />{label}</span><input type={type} name={key} value={formData[key]} onChange={handleChange} readOnly={!isEditing} /></label>)}<label className="designer-field full-field"><span><MapPin size={16} />Company address</span><textarea name="company_address" value={formData.company_address} onChange={handleChange} readOnly={!isEditing} rows={4} /></label></div>
  </section>;
}
