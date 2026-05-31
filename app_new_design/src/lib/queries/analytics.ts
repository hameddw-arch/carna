import { supabase } from '../supabase'

// Get popular listings by view count
export async function fetchPopularListings(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('id, title, make, model, price, view_count, created_at, listing_images(url)')
      .eq('status', 'active')
      .order('view_count', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data ?? []).map(listing => ({
      ...listing,
      image: listing.listing_images?.[0]?.url || null,
    }))
  } catch (error) {
    console.error('Error fetching popular listings:', error)
    return []
  }
}

// Get search analytics - most searched terms
export async function fetchSearchAnalytics(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('search_events')
      .select('search_term, count')
      .order('count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error('Error fetching search analytics:', error)
    return []
  }
}

// Get page view analytics
export async function fetchPageViewAnalytics() {
  try {
    const { data, error } = await supabase
      .from('page_view_events')
      .select('page_path, count')
      .order('count', { ascending: false })

    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error('Error fetching page view analytics:', error)
    return []
  }
}

// Record search event
export async function recordSearchEvent(searchTerm: string, resultsCount: number) {
  try {
    // First, try to update existing record
    const { data: existing } = await supabase
      .from('search_events')
      .select('id, count')
      .eq('search_term', searchTerm)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('search_events')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('search_events')
        .insert({
          search_term: searchTerm,
          count: 1,
          results_count: resultsCount,
          created_at: new Date().toISOString()
        })
      if (error) throw error
    }
  } catch (error) {
    console.warn('Error recording search event:', error)
  }
}

// Record page view event
export async function recordPageViewEvent(pagePath: string) {
  try {
    const { data: existing } = await supabase
      .from('page_view_events')
      .select('id, count')
      .eq('page_path', pagePath)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('page_view_events')
        .update({ count: existing.count + 1, last_viewed: new Date().toISOString() })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('page_view_events')
        .insert({
          page_path: pagePath,
          count: 1,
          created_at: new Date().toISOString()
        })
      if (error) throw error
    }
  } catch (error) {
    console.warn('Error recording page view event:', error)
  }
}

// Get listing analytics - view trends
export async function fetchListingViewStats(listingId: string) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('id, title, view_count, created_at')
      .eq('id', listingId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching listing view stats:', error)
    return null
  }
}

// Get filter usage analytics
export async function fetchFilterUsageAnalytics() {
  try {
    const { data, error } = await supabase
      .from('filter_events')
      .select('filter_type, filter_value, count')
      .order('count', { ascending: false })
      .limit(20)

    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error('Error fetching filter usage analytics:', error)
    return []
  }
}

// Record filter event
export async function recordFilterEvent(filterType: string, filterValue: string) {
  try {
    const { data: existing } = await supabase
      .from('filter_events')
      .select('id, count')
      .eq('filter_type', filterType)
      .eq('filter_value', filterValue)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('filter_events')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('filter_events')
        .insert({
          filter_type: filterType,
          filter_value: filterValue,
          count: 1,
          created_at: new Date().toISOString()
        })
      if (error) throw error
    }
  } catch (error) {
    console.warn('Error recording filter event:', error)
  }
}

// Get user engagement metrics
export async function fetchUserEngagementMetrics() {
  try {
    const { data: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })

    const { data: activeListings, error: listingsError } = await supabase
      .from('listings')
      .select('id', { count: 'exact' })
      .eq('status', 'active')

    const { data: totalViews } = await supabase
      .from('listings')
      .select('view_count')

    if (usersError) throw usersError
    if (listingsError) throw listingsError

    const totalViewCount = (totalViews ?? []).reduce((sum, l) => sum + (l.view_count || 0), 0)
    const avgViewsPerListing = (activeListings?.length ?? 0) > 0
      ? Math.round(totalViewCount / (activeListings?.length ?? 1))
      : 0

    return {
      totalUsers: totalUsers?.length ?? 0,
      activeListings: activeListings?.length ?? 0,
      totalViews: totalViewCount,
      avgViewsPerListing
    }
  } catch (error) {
    console.error('Error fetching engagement metrics:', error)
    return {
      totalUsers: 0,
      activeListings: 0,
      totalViews: 0,
      avgViewsPerListing: 0
    }
  }
}
