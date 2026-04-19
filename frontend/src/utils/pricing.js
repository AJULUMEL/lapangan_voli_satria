export function hitungHargaSlot(slots) {
  if (!slots || slots.length === 0) return 0;
  
  // Harga per jam berdasarkan waktu
  const H_PAGI = 15000;  // 07:00-14:00
  const H_SIANG = 20000; // 14:00-17:00
  const H_MALAM = 30000; // 18:00-22:00
  
  let total = 0;

  slots.forEach((slot) => {
    const hour = parseInt(slot.jam_mulai.split(':')[0], 10);
    if (hour >= 7 && hour < 14) {
      total += H_PAGI;
    } else if (hour >= 14 && hour < 17) {
      total += H_SIANG;
    } else if (hour >= 18 && hour < 22) {
      total += H_MALAM;
    }
  });

  // Paket siang 14-17 tepat 3 jam = 50k
  const isPaketSiang =
    slots.length === 3 &&
    slots[0].jam_mulai === '14:00' &&
    slots[slots.length - 1].jam_selesai === '17:00';

  if (isPaketSiang) return 50000;

  // Paket malam 18-22 tepat 4 jam = 100k
  const isPaketMalam =
    slots.length === 4 &&
    slots[0].jam_mulai === '18:00' &&
    slots[slots.length - 1].jam_selesai === '22:00';

  if (isPaketMalam) return 100000;

  return total;
}
