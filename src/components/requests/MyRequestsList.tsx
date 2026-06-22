import React from 'react'
import { getMyRequests } from '@/actions/requests'
import { ToolCard } from '@/components/shared/ToolCard'

export async function MyRequestsList() {
  const { data: tools, error } = await getMyRequests()

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6678', padding: '40px 20px' }}>
        Error loading requests: {error}
      </div>
    )
  }

  if (!tools || tools.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6678', padding: '40px 20px', fontSize: '14px' }}>
        You haven&apos;t submitted any requests yet.
      </div>
    )
  }

  return (
    <div>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
