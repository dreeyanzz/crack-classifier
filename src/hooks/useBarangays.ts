import { useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_BARANGAYS } from '../constants/barangays';
import {
  getCustomBarangays,
  addCustomBarangay,
  deleteCustomBarangay,
  type CustomBarangay,
} from '../services/firestoreService';

export function useBarangays() {
  const [customBarangays, setCustomBarangays] = useState<CustomBarangay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCustomBarangays()
      .then((data) => {
        if (!cancelled) setCustomBarangays(data);
      })
      .catch((err) => {
        console.error('Failed to load custom barangays:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allBarangays = useMemo(() => {
    const customNames = customBarangays.map((b) => b.name);
    const merged = [...DEFAULT_BARANGAYS, ...customNames];
    return merged.sort((a, b) => a.localeCompare(b));
  }, [customBarangays]);

  const addBarangay = useCallback(
    async (name: string): Promise<{ success: boolean; error?: string }> => {
      const trimmed = name.trim();
      if (!trimmed) return { success: false, error: 'Name cannot be empty' };

      const exists = allBarangays.some(
        (b) => b.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return { success: false, error: 'This barangay already exists' };

      try {
        const id = await addCustomBarangay(trimmed);
        setCustomBarangays((prev) =>
          [...prev, { id, name: trimmed, createdAt: null as never }].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to add barangay',
        };
      }
    },
    [allBarangays]
  );

  const removeBarangay = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await deleteCustomBarangay(id);
        setCustomBarangays((prev) => prev.filter((b) => b.id !== id));
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to remove barangay',
        };
      }
    },
    []
  );

  const isCustom = useCallback(
    (name: string) => customBarangays.some((b) => b.name === name),
    [customBarangays]
  );

  const getCustomId = useCallback(
    (name: string) => customBarangays.find((b) => b.name === name)?.id,
    [customBarangays]
  );

  return {
    barangays: allBarangays,
    customBarangays,
    loading,
    addBarangay,
    removeBarangay,
    isCustom,
    getCustomId,
  };
}
