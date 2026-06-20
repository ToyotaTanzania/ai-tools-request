import { Suspense } from 'react'
import { MyRequestsList } from '@/components/requests/MyRequestsList'

export default function MyRequestsPage() {
  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '22px', color: '#1d3c6f', margin: 0 }}>My Requests</h2>
        <p style={{ color: '#5c6678', margin: '4px 0 0', fontSize: '13.5px' }}>
          View the status of all your submitted AI tool requests.
        </p>
      </div>
      <Suspense fallback={<div style={{ color: '#5c6678', padding: '20px' }}>Loading…</div>}>
        <MyRequestsList />
      </Suspense>
    </div>
  )
}
