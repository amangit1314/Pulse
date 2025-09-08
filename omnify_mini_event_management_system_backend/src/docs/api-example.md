// docs/api-examples.md
/*
# Event Management API Examples

## Create Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2025",
    "location": "Jaipur Convention Center",
    "start_time": "2025-03-15T09:00:00+05:30",
    "end_time": "2025-03-15T17:00:00+05:30",
    "max_capacity": 100
  }'
```

## Register Attendee
```bash
curl -X POST http://localhost:3000/api/events/{event_id}/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

## Get Events (with timezone)
```bash
curl "http://localhost:3000/api/events?timezone=America/New_York"
```

## Get Attendees (paginated)
```bash
curl "http://localhost:3000/api/events/{event_id}/attendees?page=1&limit=10"
```
*/