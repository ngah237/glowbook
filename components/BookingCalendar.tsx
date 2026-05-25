'use client'

import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface BookingCalendarProps {
  salonId: string
  serviceId: string
  varianteId?: string
  onSlotSelect: (date: Date, time: string) => void
}

export default function BookingCalendar({ salonId, serviceId, varianteId, onSlotSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  useEffect(() => {
    if (selectedDate && serviceId) {
      fetchSlots()
    }
  }, [selectedDate, serviceId, varianteId])

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        salonId,
        serviceId,
        date: selectedDate.toISOString().split('T')[0]
      })
      if (varianteId) params.append('varianteId', varianteId)

      const response = await fetch(`/api/availability/slots?${params}`)
      const data = await response.json()
      setSlots(data.slots || [])
    } catch (error) {
      console.error('Erreur chargement créneaux:', error)
    } finally {
      setLoading(false)
    }
  }

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false
    // Désactiver les dates passées
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onSlotSelect(selectedDate, time)
  }

  return (
    <div className="space-y-4">
      <Calendar
        onChange={(value) => setSelectedDate(value as Date)}
        value={selectedDate}
        tileDisabled={tileDisabled}
        minDate={new Date()}
        locale="fr-FR"
        className="border rounded-lg p-2"
      />

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#C2185B] border-t-transparent mx-auto"></div>
        </div>
      )}

      {!loading && slots.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Créneaux disponibles</h3>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`py-2 rounded-lg border transition ${
                  selectedTime === time
                    ? 'bg-[#C2185B] text-white border-[#C2185B]'
                    : 'border-stone-200 hover:border-[#C2185B]'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && slots.length === 0 && (
        <p className="text-center text-stone-500 py-4">
          Aucun créneau disponible pour cette date
        </p>
      )}
    </div>
  )
}