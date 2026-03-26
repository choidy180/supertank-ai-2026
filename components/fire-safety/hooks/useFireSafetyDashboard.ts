'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FACTORY_ZONES,
  INSPECTION_HISTORY
} from '../model/constants';
import { InspectionRecord, FlattenedEquipment } from '../model/types';

export const useFireSafetyDashboard = () => {
  const allEquipments = useMemo<FlattenedEquipment[]>(() => {
    return FACTORY_ZONES.flatMap((zone) =>
      zone.equipments.map((equipment) => ({
        ...equipment,
        zoneId: zone.id,
        zoneName: zone.name,
        zoneFloor: zone.floor,
        zoneWidth: zone.width,
        zoneHeight: zone.height,
        coordinateOrigin: zone.coordinateOrigin
      }))
    );
  }, []);

  const [selectedEquipmentId, setSelectedEquipmentId] =
    useState<string>('ext-a-03');
  const [selectedInspectionId, setSelectedInspectionId] = useState<
    string | null
  >(null);

  const selectedEquipment = useMemo(() => {
    return (
      allEquipments.find((equipment) => equipment.id === selectedEquipmentId) ??
      allEquipments[0]
    );
  }, [allEquipments, selectedEquipmentId]);

  const selectedInspection = useMemo(() => {
    return (
      INSPECTION_HISTORY.find((record) => record.id === selectedInspectionId) ??
      null
    );
  }, [selectedInspectionId]);

  const stableCount = useMemo(() => {
    return allEquipments.filter(
      (equipment) => equipment.replacementState === 'stable'
    ).length;
  }, [allEquipments]);

  const replaceNowCount = useMemo(() => {
    return allEquipments.filter(
      (equipment) => equipment.replacementState === 'replace-now'
    ).length;
  }, [allEquipments]);

  const dueSoonCount = useMemo(() => {
    return allEquipments.filter(
      (equipment) => equipment.replacementState === 'due-soon'
    ).length;
  }, [allEquipments]);

  const alertEquipments = useMemo(() => {
    return allEquipments
      .filter((equipment) => equipment.replacementState !== 'stable')
      .sort((a, b) => a.nextReplacement.localeCompare(b.nextReplacement));
  }, [allEquipments]);

  const relatedInspection = useMemo(() => {
    return (
      INSPECTION_HISTORY.find(
        (record) => record.equipmentId === selectedEquipment.id
      ) ?? null
    );
  }, [selectedEquipment.id]);

  const zoneInspectionCounts = useMemo(() => {
    return INSPECTION_HISTORY.reduce<Record<string, number>>((acc, record) => {
      acc[record.zoneId] = (acc[record.zoneId] ?? 0) + 1;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedInspectionId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const openInspection = (record: InspectionRecord) => {
    setSelectedInspectionId(record.id);
    setSelectedEquipmentId(record.equipmentId);
  };

  const closeInspection = () => {
    setSelectedInspectionId(null);
  };

  return {
    factoryZones: FACTORY_ZONES,
    inspectionHistory: INSPECTION_HISTORY,
    allEquipments,
    selectedEquipment,
    selectedInspection,
    selectedInspectionId,
    stableCount,
    replaceNowCount,
    dueSoonCount,
    alertEquipments,
    relatedInspection,
    zoneInspectionCounts,
    actions: {
      selectEquipment: setSelectedEquipmentId,
      openInspection,
      closeInspection
    }
  };
};
