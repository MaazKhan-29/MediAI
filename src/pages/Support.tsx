import React, { useState } from 'react';
import { Building2, Phone, Mail, MapPin, Edit, Save, X, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Support() {
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalData, setHospitalData] = useState({
    name: "MediAI Central Hospital",
    address: "123 Healthcare Ave, Medical District",
    phone: "+1 (555) 012-3456",
    email: "support@mediai.health",
    about: "MediAI Central Hospital is a state-of-the-art facility dedicated to providing comprehensive and advanced medical care. We integrate modern AI technologies with compassionate healthcare to ensure the best outcomes for our patients.",
    status: "Active"
  });

  const [editForm, setEditForm] = useState(hospitalData);

  const handleSave = () => {
    setHospitalData(editForm);
    setIsEditing(false);
    toast.success("Hospital information updated successfully");
  };

  const handleCancel = () => {
    setEditForm(hospitalData);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-heading mb-4 text-foreground">Contact & Support</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get in touch with our primary care facility.
        </p>
      </div>

      <Card className="glass-card shadow-elevated">
        <CardHeader className="pb-4 border-b border-border/50 bg-primary/5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              {isEditing ? (
                <div className="space-y-1 w-full max-w-xs">
                  <Input 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="font-bold text-xl h-10"
                  />
                  <div className="flex gap-2 text-sm mt-2">
                     Status: 
                     <Input 
                        value={editForm.status} 
                        onChange={e => setEditForm({...editForm, status: e.target.value})}
                        className="h-7 w-24 text-xs"
                     />
                  </div>
                </div>
              ) : (
                <div>
                  <CardTitle className="text-2xl">{hospitalData.name}</CardTitle>
                  <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                    {hospitalData.status}
                  </span>
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" /> Edit Details
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-2 text-muted-foreground">
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="gap-2 gradient-primary btn-premium">
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> About Us
            </h3>
            {isEditing ? (
              <Textarea 
                value={editForm.about}
                onChange={e => setEditForm({...editForm, about: e.target.value})}
                rows={4}
                className="resize-none"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {hospitalData.about}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
            {/* Contact Details */}
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                  {isEditing ? (
                    <div className="w-full">
                       <label className="text-xs text-muted-foreground mb-1 block">Address</label>
                      <Input 
                        value={editForm.address} 
                        onChange={e => setEditForm({...editForm, address: e.target.value})}
                        className="h-10"
                      />
                    </div>
                  ) : (
                    <div>
                        <span className="text-sm text-muted-foreground block mb-0.5">Address</span>
                        <span className="font-medium">{hospitalData.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                  {isEditing ? (
                     <div className="w-full">
                        <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                      <Input 
                        value={editForm.phone} 
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                        className="h-10"
                      />
                    </div>
                  ) : (
                     <div>
                        <span className="text-sm text-muted-foreground block mb-0.5">Phone</span>
                        <span className="font-medium">{hospitalData.phone}</span>
                     </div>
                  )}
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                  {isEditing ? (
                     <div className="w-full">
                        <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                      <Input 
                        value={editForm.email} 
                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                        className="h-10"
                      />
                    </div>
                  ) : (
                     <div>
                        <span className="text-sm text-muted-foreground block mb-0.5">Email</span>
                        <span className="font-medium">{hospitalData.email}</span>
                     </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions / Demo Calling */}
            <div className="space-y-4">
               <h3 className="font-semibold text-lg">Quick Support</h3>
               <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-5 h-full">
                  <p className="text-sm text-muted-foreground">Our support team is available 24/7 for urgent clinical or technical inquiries. Reach out to us anytime.</p>
                  <div className="flex flex-col gap-3">
                    <Button 
                        className="w-full gap-2 gradient-primary text-primary-foreground btn-premium" 
                        onClick={() => toast.success("Calling Support Center...")}
                     >
                      <Phone className="h-4 w-4" /> Call Support Now
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full gap-2 glass" 
                        onClick={() => {
                           window.location.href = `mailto:${hospitalData.email}`;
                           toast.info("Opening default email client...");
                        }}
                     >
                      <Mail className="h-4 w-4" /> Send Email
                    </Button>
                  </div>
               </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
