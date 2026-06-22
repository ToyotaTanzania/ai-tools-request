import React from 'react'
import { getRegistry } from '@/actions/registry'
import { ToolCard } from '@/components/shared/ToolCard'
import { StatsRow } from './StatsRow'

export async function RegistryTable() {
  const { data: tools, error } = await getRegistry()

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6678', padding: '40px 20px' }}>
        Error loading registry: {error}
      </div>
    )
  }

  if (!tools || tools.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6678', padding: '40px 20px', fontSize: '14px' }}>
        No tools have been submitted yet.
      </div>
    )
  }

  return (
    <div>
      <StatsRow tools={tools} />
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
