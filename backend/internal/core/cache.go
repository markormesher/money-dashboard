package core

import (
	"sync"
)

type cacheEntry[K comparable, V any] struct {
	Key   K
	Value V

	nextEntry *cacheEntry[K, V]
	prevEntry *cacheEntry[K, V]
}

type Cache[K comparable, V any] struct {
	Capacity int

	lookup    map[K]*cacheEntry[K, V]
	headEntry *cacheEntry[K, V]
	tailEntry *cacheEntry[K, V]

	mutex sync.Mutex
}

func MakeCache[K comparable, V any](capacity int) Cache[K, V] {
	return Cache[K, V]{
		Capacity: capacity,
		lookup:   make(map[K]*cacheEntry[K, V], capacity+1),
	}
}

func (c *Cache[K, V]) Get(key K) (V, bool) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	entry, ok := c.lookup[key]
	if !ok {
		var zero V
		return zero, false
	}

	c.promote(key)

	return entry.Value, true
}

func (c *Cache[K, V]) Put(key K, value V) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	// promote this value if we already have it, then exit early
	_, ok := c.lookup[key]
	if ok {
		c.promote(key)
		return
	}

	entry := &cacheEntry[K, V]{
		Key:   key,
		Value: value,
	}
	c.lookup[key] = entry
	c.promote(key)
	c.enforceCapacity()
}

func (c *Cache[K, V]) EvictAll() {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	c.headEntry = nil
	c.tailEntry = nil
	for k := range c.lookup {
		delete(c.lookup, k)
	}
}

func (c *Cache[K, V]) promote(key K) {
	entry, ok := c.lookup[key]
	if !ok {
		return
	}

	if c.headEntry == entry {
		// already the head, no work to do
		return
	}

	// connect the elements on either side of this entry to each other
	if entry.nextEntry != nil {
		entry.nextEntry.prevEntry = entry.prevEntry
	}
	if entry.prevEntry != nil {
		entry.prevEntry.nextEntry = entry.nextEntry
	}

	// re-insert at the head
	entry.prevEntry = nil
	entry.nextEntry = c.headEntry

	if c.headEntry != nil {
		c.headEntry.prevEntry = entry
	}

	c.headEntry = entry

	// special case: if this is the only element, set it as the tail too
	if len(c.lookup) == 1 {
		c.tailEntry = entry
	}
}

func (c *Cache[K, V]) enforceCapacity() {
	if c.Capacity <= 0 {
		return
	}

	for {
		if len(c.lookup) <= c.Capacity {
			return
		}

		// remove tail element
		delete(c.lookup, c.tailEntry.Key)
		if c.tailEntry.prevEntry != nil {
			c.tailEntry.prevEntry.nextEntry = nil
		}
		c.tailEntry = c.tailEntry.prevEntry
	}
}
