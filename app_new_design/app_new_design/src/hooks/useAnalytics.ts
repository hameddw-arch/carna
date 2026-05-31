import { useEffect } from 'react'
import {
  recordPageViewEvent,
  recordSearchEvent,
  recordFilterEvent,
  incrementListingViews
} from '../lib/queries/analytics'

// Track page views on route changes
export function usePageView(pagePath: string) {
  useEffect(() => {
    if (pagePath) {
      recordPageViewEvent(pagePath).catch(err => {
        console.warn('Failed to record page view:', err)
      })
    }
  }, [pagePath])
}

// Track search events
export async function trackSearch(searchTerm: string, resultsCount: number) {
  try {
    await recordSearchEvent(searchTerm, resultsCount)
  } catch (error) {
    console.warn('Failed to track search:', error)
  }
}

// Track filter usage
export async function trackFilter(filterType: string, filterValue: string) {
  try {
    await recordFilterEvent(filterType, filterValue)
  } catch (error) {
    console.warn('Failed to track filter:', error)
  }
}

// Track listing view
export async function trackListingView(listingId: string) {
  try {
    await incrementListingViews(listingId)
  } catch (error) {
    console.warn('Failed to increment listing views:', error)
  }
}
