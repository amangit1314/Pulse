// export type Event = {
//   id: string;
//   name: string;
//   slug: string;
//   location: string;
//   start_time: Date;
//   end_time: Date;
//   max_capacity: number;
// };


export type Event = {
  id: string;
  name: string;
  slug: string;
  location: string;
  latitude?: string | null;
  longitude?: string | null;
  startTime: string; // API returns ISO string
  endTime: string;   // API returns ISO string
  maxCapacity: number;
  createdAt: string;
  updatedAt: string;
};
