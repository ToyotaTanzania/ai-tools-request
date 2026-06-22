import React from 'react'
import { getQueue } from '@/actions/decisions'
import { ToolCard } from '@/components/shared/ToolCard'
import { DecisionForm } from './DecisionForm'

export async function QueueList() {
  const { data: tools, error } = await getQueue()

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6678', padding: '40px 20px' }}>
        Error loading queue: {error}
      </div>
    )
  }

  if (!tools || tools.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6678', padding: '40px 20px', fontSize: '14px' }}>
        Your review queue is empty.
      </div>
    )
  }

  return (
    <div>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool}>
          <DecisionForm toolId={tool.id} />
        </ToolCard>
      ))}
    </div>
  )
}
