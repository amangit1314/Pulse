// "use client";

// import { useState } from "react";
// import { Loader2, PlusCircle } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { dmSans, spaceGrotesk } from "@/lib/fonts";
// import { useEventStore } from "@/stores/useEventStore";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useCreateEvent } from "@/hooks/useEvents";
// import toast, { Toaster } from "react-hot-toast";

// const addEventSchema = z.object({
//   name: z.string().min(3, "Event name must be at least 3 characters"),
//   location: z.string().min(3, "Location must be at least 3 characters"),
//   startTime: z.string().nonempty("Start time is required"),
//   endTime: z.string().nonempty("End time is required"),
//   maxCapacity: z
//     .string()
//     .refine(
//       (val) => !isNaN(Number(val)) && Number(val) > 0,
//       "Capacity must be a positive number"
//     ),
// });

// type AddEventFormData = z.infer<typeof addEventSchema>;

// const AddEventComponent = () => {
//   const [open, setOpen] = useState(false);

//   // form state
//   const [name, setName] = useState("");

//   const [slug, setSlug] = useState("");

//   function slugify(text: string, id: string | number) {
//     return (
//       text
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)+/g, "") +
//       "-" +
//       id
//     );
//   }

//   // Update slug when name changes
//   useEffect(() => {
//     // Use timestamp as a simple unique id for new events
//     const uniqueId = Date.now().toString();
//     if (name) {
//       setSlug(slugify(name, uniqueId));
//     } else {
//       setSlug("");
//     }
//   }, [name]);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//     watch, // ✅ added
//     setValue, // ✅ added
//   } = useForm<AddEventFormData>({
//     resolver: zodResolver(addEventSchema),
//   });

//   const { mutate: createEvent, isPending } = useCreateEvent();

//   const onSubmit = (data: AddEventFormData) => {
//     createEvent(
//       {
//         ...data,
//         maxCapacity: Number(data.maxCapacity),
//         timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//       },
//       {
//         onSuccess: () => {
//           reset();
//           toast.success("Event created successfully 🎉");
//           setOpen(false);
//         },
//         onError: (error) => {
//           reset();
//           toast.error(`${error.message}`);
//         },
//       }
//     );
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className={`flex items-center gap-2 py-1 bg-indigo-600 hover:bg-indigo-700 ${spaceGrotesk.className}`}
//         >
//           <PlusCircle className="w-5 h-5" /> Add Event
//         </Button>
//       </DialogTrigger>

//       <DialogContent className={`max-w-md rounded-2xl ${dmSans.className}`}>
//         <Toaster />

//         <DialogHeader>
//           <DialogTitle
//             className={`text-lg font-semibold ${spaceGrotesk.className}`}
//           >
//             Create New Event
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Event Name */}
//           <div>
//             <Label htmlFor="name" className="mb-2">
//               Event Name
//             </Label>
//             <Input
//               id="name"
//               {...register("name")}
//               placeholder="Enter event name"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Location */}
//           <div>
//             <Label htmlFor="location" className="mb-2">
//               Location
//             </Label>
//             <Input
//               id="location"
//               {...register("location")}
//               placeholder="Enter event location"
//             />
//             {errors.location && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.location.message}
//               </p>
//             )}
//           </div>

//           {/* Start Time */}
//           <div>
//             <Label htmlFor="startTime" className="mb-2">
//               Start Time
//             </Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start rounded-xl text-left font-normal"
//                 >
//                   {watch("startTime")
//                     ? format(new Date(watch("startTime")), "PPpp").replace(/:\d{2}(?=\s[AP]M)/, "")
//                     : "Select event start date & time"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="p-4 space-y-4" align="start">
//                 {/* Calendar Picker */}
//                 <Calendar
//                   mode="single"
//                   selected={
//                     watch("startTime")
//                       ? new Date(watch("startTime"))
//                       : undefined
//                   }
//                   onSelect={(date) => {
//                     const current = watch("startTime")
//                       ? new Date(watch("startTime"))
//                       : new Date();
//                     if (date) {
//                       current.setFullYear(date.getFullYear());
//                       current.setMonth(date.getMonth());
//                       current.setDate(date.getDate());
//                       setValue("startTime", current.toISOString(), {
//                         shouldValidate: true,
//                       });
//                     }
//                   }}
//                 />

//                 {/* Time Picker */}
//                 <div className="flex gap-2">
//                   <Select
//                     value={
//                       watch("startTime")
//                         ? new Date(watch("startTime")).getHours().toString()
//                         : undefined
//                     }
//                     onValueChange={(hour) => {
//                       const current = watch("startTime")
//                         ? new Date(watch("startTime"))
//                         : new Date();
//                       current.setHours(parseInt(hour, 10));
//                       setValue("startTime", current.toISOString(), {
//                         shouldValidate: true,
//                       });
//                     }}
//                   >
//                     <SelectTrigger className="w-[100px]">
//                       <SelectValue placeholder="Hour" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Array.from({ length: 24 }).map((_, i) => (
//                         <SelectItem key={i} value={i.toString()}>
//                           {i.toString().padStart(2, "0")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Select
//                     value={
//                       watch("startTime")
//                         ? new Date(watch("startTime")).getMinutes().toString()
//                         : undefined
//                     }
//                     onValueChange={(minute) => {
//                       const current = watch("startTime")
//                         ? new Date(watch("startTime"))
//                         : new Date();
//                       current.setMinutes(parseInt(minute, 10));
//                       setValue("startTime", current.toISOString(), {
//                         shouldValidate: true,
//                       });
//                     }}
//                   >
//                     <SelectTrigger className="w-[100px]">
//                       <SelectValue placeholder="Minute" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Array.from({ length: 60 }).map((_, i) => (
//                         <SelectItem key={i} value={i.toString()}>
//                           {i.toString().padStart(2, "0")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </PopoverContent>
//             </Popover>
//             <p className="text-gray-500 text-xs mt-1">
//               Choose when the event will begin.
//             </p>
//             {errors.startTime && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.startTime.message || "Start time is required"}
//               </p>
//             )}
//           </div>

//           {/* End Time */}
//           <div>
//             <Label htmlFor="endTime" className="mb-2">
//               End Time
//             </Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start rounded-xl text-left font-normal"
//                 >
//                   {watch("endTime")
//                     ? format(new Date(watch("endTime")), "PPpp").replace(/:\d{2}(?=\s[AP]M)/, "")
//                     : "Select event end date & time"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="p-4 space-y-4" align="start">
//                 {/* Calendar Picker */}
//                 <Calendar
//                   mode="single"
//                   selected={
//                     watch("endTime") ? new Date(watch("endTime")) : undefined
//                   }
//                   onSelect={(date) => {
//                     const current = watch("endTime")
//                       ? new Date(watch("endTime"))
//                       : new Date();
//                     if (date) {
//                       current.setFullYear(date.getFullYear());
//                       current.setMonth(date.getMonth());
//                       current.setDate(date.getDate());
//                       setValue("endTime", current.toISOString(), {
//                         shouldValidate: true,
//                       });
//                     }
//                   }}
//                 />

//                 {/* End Time Picker */}
//                 <div className="flex gap-2">
//                   <Select
//                     value={
//                       watch("endTime")
//                         ? new Date(watch("endTime")).getHours().toString()
//                         : undefined
//                     }
//                     onValueChange={(hour) => {
//                       const current = watch("endTime")
//                         ? new Date(watch("endTime"))
//                         : new Date();
//                       current.setHours(parseInt(hour, 10));
//                       setValue("endTime", current.toISOString(), {
//                         shouldValidate: true,
//                       });
//                     }}
//                   >
//                     <SelectTrigger className="w-[100px]">
//                       <SelectValue placeholder="Hour" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Array.from({ length: 24 }).map((_, i) => (
//                         <SelectItem key={i} value={i.toString()}>
//                           {i.toString().padStart(2, "0")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Select
//                     value={
//                       watch("endTime")
//                         ? new Date(watch("endTime")).getMinutes().toString()
//                         : undefined
//                     }
//                     onValueChange={(minute) => {
//                       const current = watch("endTime")
//                         ? new Date(watch("endTime"))
//                         : new Date();
//                       current.setMinutes(parseInt(minute, 10));
//                       setValue("endTime", current.toISOString(), {
//                         shouldValidate: true,
//                       });
//                     }}
//                   >
//                     <SelectTrigger className="w-[100px]">
//                       <SelectValue placeholder="Minute" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Array.from({ length: 60 }).map((_, i) => (
//                         <SelectItem key={i} value={i.toString()}>
//                           {i.toString().padStart(2, "0")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </PopoverContent>
//             </Popover>
//             <p className="text-gray-500 text-xs mt-1">
//               Choose when the event will end.
//             </p>
//             {errors.endTime && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.endTime.message || "End time is required"}
//               </p>
//             )}
//           </div>

//           {/* Capacity */}
//           <div>
//             <Label htmlFor="maxCapacity" className="mb-2">
//               Max Capacity
//             </Label>
//             <Input
//               type="number"
//               id="maxCapacity"
//               {...register("maxCapacity")}
//               placeholder="Enter max attendees"
//             />
//             {errors.maxCapacity && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.maxCapacity.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             disabled={isPending}
//             className="w-full bg-black text-white hover:bg-gray-800 transition-all"
//           >
//             {isPending ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Creating...
//               </span>
//             ) : (
//               "Create Event"
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddEventComponent;

"use client";

import { useState } from "react";
import { Loader2, PlusCircle, CalendarIcon, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { dmSans, spaceGrotesk } from "@/lib/fonts";
import { useEventStore } from "@/stores/useEventStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateEvent } from "@/hooks/useEvents";
import toast, { Toaster } from "react-hot-toast";

const addEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  startDate: z.string().nonempty("Start date is required"),
  startHour: z.string().nonempty("Start hour is required"),
  startMinute: z.string().nonempty("Start minute is required"),
  endDate: z.string().nonempty("End date is required"),
  endHour: z.string().nonempty("End hour is required"),
  endMinute: z.string().nonempty("End minute is required"),
  maxCapacity: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Capacity must be a positive number"
    ),
});

type AddEventFormData = z.infer<typeof addEventSchema>;

const AddEventComponent = () => {
  const [open, setOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  function slugify(text: string, id: string | number) {
    return (
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      id
    );
  }

  // Update slug when name changes
  useEffect(() => {
    const uniqueId = Date.now().toString();
    if (name) {
      setSlug(slugify(name, uniqueId));
    } else {
      setSlug("");
    }
  }, [name]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AddEventFormData>({
    resolver: zodResolver(addEventSchema),
  });

  const { mutate: createEvent, isPending } = useCreateEvent();

  // Helper function to combine date and time into ISO string
  const createDateTime = (dateStr: string, hour: string, minute: string) => {
    const date = new Date(dateStr);
    date.setHours(parseInt(hour, 10));
    date.setMinutes(parseInt(minute, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  };

  const onSubmit = (data: AddEventFormData) => {
    // Combine date and time into proper datetime strings
    const startTime = createDateTime(
      data.startDate,
      data.startHour,
      data.startMinute
    );
    const endTime = createDateTime(data.endDate, data.endHour, data.endMinute);

    // Validation: End time should be after start time
    if (new Date(endTime) <= new Date(startTime)) {
      toast.error("End time must be after start time");
      return;
    }

    createEvent(
      {
        name: data.name,
        location: data.location,
        startTime,
        endTime,
        maxCapacity: Number(data.maxCapacity),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      {
        onSuccess: () => {
          reset();
          setName("");
          setSlug("");
          toast.success("Event created successfully 🎉");
          setOpen(false);
        },
        onError: (error) => {
          toast.error(`${error.message}`);
        },
      }
    );
  };

  // Helper function to format date display
  const formatDateDisplay = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return null;
    }
  };

  // Generate hour options
  const hourOptions = Array.from({ length: 24 }).map((_, i) => ({
    value: i.toString(),
    label: i.toString().padStart(2, "0"),
  }));

  // Generate minute options (every 15 minutes)
  const minuteOptions = [0, 15, 30, 45].map((minute) => ({
    value: minute.toString(),
    label: minute.toString().padStart(2, "0"),
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`flex items-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors ${spaceGrotesk.className}`}
        >
          <PlusCircle className="w-5 h-5" /> Add Event
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`max-w-2xl max-h-[90vh] rounded-2xl border-0 shadow-2xl overflow-y-auto ${dmSans.className}`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />

        <DialogHeader className="space-y-3">
          <DialogTitle
            className={`text-xl font-semibold text-gray-900 ${spaceGrotesk.className}`}
          >
            Create New Event
          </DialogTitle>
          <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4 pb-4">
          {/* Event Name & Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Event Name *
              </Label>
              <Input
                id="name"
                {...register("name")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  register("name").onChange(e);
                }}
                placeholder="Enter event name"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium text-gray-700"
              >
                Location *
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Enter event location"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Start Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h3
                className={`text-lg font-medium text-gray-800 ${spaceGrotesk.className}`}
              >
                Event Start
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
              {/* Start Date */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">
                  Start Date *
                </Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start rounded-lg text-left font-normal border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="truncate">
                        {formatDateDisplay(watch("startDate")) ||
                          "Select start date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        watch("startDate")
                          ? new Date(watch("startDate"))
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          setValue("startDate", date.toISOString(), {
                            shouldValidate: true,
                          });
                          setStartDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Start Time *
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={watch("startHour")}
                    onValueChange={(value) =>
                      setValue("startHour", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Hr" />
                    </SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={watch("startMinute")}
                    onValueChange={(value) =>
                      setValue("startMinute", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {minuteOptions.map((minute) => (
                        <SelectItem key={minute.value} value={minute.value}>
                          {minute.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(errors.startHour || errors.startMinute) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    Start time is required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* End Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <h3
                className={`text-lg font-medium text-gray-800 ${spaceGrotesk.className}`}
              >
                Event End
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
              {/* End Date */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">
                  End Date *
                </Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start rounded-lg text-left font-normal border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="truncate">
                        {formatDateDisplay(watch("endDate")) ||
                          "Select end date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        watch("endDate")
                          ? new Date(watch("endDate"))
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          setValue("endDate", date.toISOString(), {
                            shouldValidate: true,
                          });
                          setEndDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  End Time *
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={watch("endHour")}
                    onValueChange={(value) =>
                      setValue("endHour", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Hr" />
                    </SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={watch("endMinute")}
                    onValueChange={(value) =>
                      setValue("endMinute", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {minuteOptions.map((minute) => (
                        <SelectItem key={minute.value} value={minute.value}>
                          {minute.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(errors.endHour || errors.endMinute) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    End time is required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label
              htmlFor="maxCapacity"
              className="text-sm font-medium text-gray-700"
            >
              Maximum Capacity *
            </Label>
            <Input
              type="number"
              id="maxCapacity"
              {...register("maxCapacity")}
              placeholder="Enter max attendees"
              min="1"
              className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors max-w-xs"
            />
            {errors.maxCapacity && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.maxCapacity.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isPending}
              className={`w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${spaceGrotesk.className}`}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Event...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Create Event
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventComponent;
