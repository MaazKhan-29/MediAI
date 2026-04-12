import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { doctorsAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(
    user?.schedule || user?.doctorProfile?.schedule || DAYS.map(day => ({
      day,
      startTime: day === 'Sunday' ? '00:00' : '09:00',
      endTime: day === 'Sunday' ? '00:00' : '17:00',
      isAvailable: day !== 'Sunday',
    }))
  );
  const [loading, setLoading] = useState(false);

  const updateSlot = (index: number, field: string, value: any) => {
    const updated = [...schedule];
    (updated[index] as any)[field] = value;
    setSchedule(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await doctorsAPI.updateAvailability({ schedule });
      toast({ title: '✅ Schedule updated successfully' });
    } catch (error: any) {
      toast({ title: error.response?.data?.message || 'Failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Availability Schedule</h1>
        <p className="mt-1 text-muted-foreground">Set your working hours for each day</p>
      </motion.div>

      <div className="mt-6 w-full space-y-3">
        {schedule.map((slot: any, i: number) => (
          <div
            key={slot.day}
            className={`flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all ${
              !slot.isAvailable ? 'opacity-50' : ''
            }`}
          >
            <div className="w-28">
              <p className="font-medium text-foreground">{slot.day}</p>
            </div>

            <button
              type="button"
              onClick={() => updateSlot(i, 'isAvailable', !slot.isAvailable)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${slot.isAvailable ? 'bg-green-500' : 'bg-muted'}`}
            >
              <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${slot.isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>

            {slot.isAvailable && (
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="time"
                    className="h-9 w-28"
                    value={slot.startTime}
                    onChange={e => updateSlot(i, 'startTime', e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  className="h-9 w-28"
                  value={slot.endTime}
                  onChange={e => updateSlot(i, 'endTime', e.target.value)}
                />
              </div>
            )}

            {!slot.isAvailable && (
              <span className="text-sm text-muted-foreground">Day off</span>
            )}
          </div>
        ))}

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-11 gradient-primary border-0 text-primary-foreground hover:opacity-90 mt-4"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>
    </div>
  );
}
