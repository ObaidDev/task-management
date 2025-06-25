"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}



function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}



interface Calendar28Props {
  label?: string
  placeholder?: string
  value?: number // timestamp
  onChange?: (event: { target: { name: string; value: number } }) => void
  name?: string
  required?: boolean
  className?: string
}

export function Calendar28({ 
    label = "Date",
    placeholder = "Select date",
    value,
    onChange,
    name = "date",
    required = false,
    className = ""
    }: Readonly<Calendar28Props>){
    

  const [open, setOpen] = React.useState(false)


  const initialDate = value ? new Date(value) : undefined
  const [date, setDate] = React.useState<Date | undefined>(initialDate)
  const [month, setMonth] = React.useState<Date | undefined>(initialDate)
  const [inputValue, setInputValue] = React.useState(formatDate(initialDate))

   React.useEffect(() => {
    const newDate = value ? new Date(value) : undefined
    setDate(newDate)
    setMonth(newDate)
    setInputValue(formatDate(newDate))
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(formatDate(selectedDate))
    setOpen(false)
    
    // Call onChange with timestamp
    if (onChange) {
      const timestamp = selectedDate ? selectedDate.getTime() : 0
      onChange({
        target: { name, value: timestamp }
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value
    setInputValue(inputVal)
    
    const parsedDate = new Date(inputVal)
    if (isValidDate(parsedDate)) {
      setDate(parsedDate)
      setMonth(parsedDate)
      
      // Call onChange with timestamp
      if (onChange) {
        onChange({
          target: { name, value: parsedDate.getTime() }
        })
      }
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Label htmlFor={name} className="px-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id={name}
          name={name}
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
          required={required}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}