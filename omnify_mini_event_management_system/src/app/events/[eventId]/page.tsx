"use client";

import { format } from "date-fns";
import { spaceGrotesk, dmSans } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Pin, Users } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useRegisterAttendee, useEventAttendees } from "@/hooks/useEvents";
import { useEventStore } from "@/stores/useEventStore";
import { BackButton } from "@/components/common/BackButton";

export default function EventPage() {
  const { currentEvent: event } = useEventStore();

  if (!event) {
    return (
      <div className="container max-w-4xl mx-auto px-6 py-12 text-center text-red-600">
        Event data not found ❌
      </div>
    );
  }

  const [form, setForm] = useState({ name: "", email: "" });

  // Fetch attendees
  const { data: attendeesData, isLoading: loadingAttendees } =
    useEventAttendees(event.id);

  const attendees = attendeesData?.attendees || [];

  // Register mutation
  const { mutate: register, isPending: isRegistering } = useRegisterAttendee(
    event.id
  );

  const handleRegister = () => {
    if (!form.name || !form.email) return toast.error("Fill all fields!");
    if (attendees.some((a: any) => a.email === form.email))
      return toast.error("Already registered!");
    if (attendees.length >= event.maxCapacity)
      return toast.error("Event is full!");

    // Call mutate with callbacks here
    register(
      { name: form.name, email: form.email },
      {
        onSuccess: () => {
          toast.success("Successfully registered!");
          setForm({ name: "", email: "" });
        },
        onError: () => {
          toast.error("Registration failed!");
        },
      }
    );
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 pb-6">
      <Toaster />

      <BackButton />

      {/* Event Details Card */}
      <Card className="mt-4 mb-10 border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className={`${dmSans.className} text-lg font-semibold`}>
            {event.name}
          </CardTitle>
          <CardDescription className={`${dmSans.className}`}>
            Event Details
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`${dmSans.className} text-sm text-zinc-700 px-6 pb-6`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Pin className="text-indigo-600 h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <p className="mb-1">
            <span className="font-medium">When:</span>{" "}
            {format(new Date(event.startTime), "MM/dd/yyyy, hh:mm a")} →{" "}
            {format(new Date(event.endTime), "MM/dd/yyyy, hh:mm a")}
          </p>
          <p className="flex items-center gap-2 mt-2">
            <Users className="h-4 w-4 text-indigo-600" />
            <span>
              <span className="font-medium">Capacity:</span> {attendees.length}/
              {event.maxCapacity}
            </span>
          </p>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      {/* Registration Form */}
      <Card className="mb-12 border border-zinc-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle
            className={`${dmSans.className} text-lg font-semibold text-zinc-900`}
          >
            Register for this Event
          </CardTitle>
          <CardDescription className={`${dmSans.className}`}>
            Secure your spot by filling in your details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <Button
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full md:w-fit rounded-xl"
            >
              {isRegistering ? "Registering..." : "Register Now"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendees List */}
      <Card className="border border-zinc-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle
            className={`${dmSans.className} text-lg font-semibold text-zinc-900`}
          >
            Attendees
          </CardTitle>
          <CardDescription className={`${dmSans.className}`}>
            People who have registered for this event
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingAttendees ? (
            <p className="text-sm text-zinc-500">Loading attendees…</p>
          ) : attendees.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No attendees yet. Be the first to register 🎉
            </p>
          ) : (
            <ul className="text-sm divide-y divide-zinc-100">
              {attendees.map((a: any) => (
                <li key={a.id} className="py-2 flex justify-between">
                  <span className="font-medium text-zinc-800">{a.name}</span>
                  <span className="text-zinc-500">{a.email}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
