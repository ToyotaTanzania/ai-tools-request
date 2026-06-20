import { NewRequestForm } from '@/components/requests/NewRequestForm'

export default function NewRequestPage() {
  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '22px', color: '#1d3c6f', margin: 0 }}>New AI Tool Request</h2>
        <p style={{ color: '#5c6678', margin: '4px 0 0', fontSize: '13.5px' }}>
          Submit one or more AI tools for vetting and approval.
        </p>
      </div>
      <NewRequestForm />
    </div>
  )
}
