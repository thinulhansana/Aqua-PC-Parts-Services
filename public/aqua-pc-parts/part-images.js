(function () {
  "use strict";

  const CAT_ICONS = {
    monitors: "assets/cats/monitors.webp",
    "vga-cards": "assets/cats/vga-cards.webp",
    processors: "assets/cats/processors.webp",
    motherboards: "assets/cats/motherboards.webp",
    storage: "assets/cats/storage.webp",
    ram: "assets/cats/ram.webp",
    "power-supply": "assets/cats/power-supply.webp",
    cooling: "assets/cats/cooling.webp",
    cables: "assets/cats/cables.webp",
    peripherals: "assets/cats/peripherals.webp",
    "bn-mice": "assets/cats/peripherals.webp",
    "bn-combos": "assets/cats/peripherals.webp",
    "bn-keyboards": "assets/cats/peripherals.webp",
    "bn-webcams": "assets/cats/webcam.webp",
    "bn-microphones": "assets/cats/audio.webp",
    "bn-sound-cards": "assets/cats/audio.webp",
    "bn-components": "assets/cats/expansion.webp",
  };

  window.getAquaCategoryIcon = function (sectionId) {
    return CAT_ICONS[sectionId] || "assets/cats/expansion.webp";
  };

  window.getAquaPartImage = function (item, sectionId, subcatName) {
    if (item && typeof item.image === "string" && item.image.trim()) {
      return item.image.trim();
    }
    const name = ((item && item.name) || "").toLowerCase();
    const sub = (subcatName || (item && item.sub) || "").toLowerCase();
    const sec = (sectionId || (item && item.sec) || "").toLowerCase();
    const text = name + " " + sub;

    // 1. Graphics Cards
    if (sec === "vga-cards" || /\b(gtx|rtx|gt ?\d|rx ?\d|radeon|quadro|vga|geforce)\b/.test(text)) {
      if (/\b(rtx ?40|rtx ?309|rtx ?308|rtx ?307|rtx ?507|rtx ?508|rtx ?509|3 fan|triple|trio|ventus 3x)\b/.test(text)) {
        return "assets/parts/gpu-rtx-triple.webp";
      }
      if (/\b(rtx ?30|rtx ?5060)\b/.test(text)) return "assets/parts/gpu-msi.webp";
      if (/\b(rtx ?20|gtx ?166|1650|prime|oc)\b/.test(text)) return "assets/parts/gpu-prime.webp";
      if (/\b(rtx)\b/.test(text)) return "assets/parts/gpu-rtx-dual.webp";
      return "assets/parts/gpu-gtx.webp";
    }

    // 2. Processors
    if (sec === "processors" || /\b(core i[3579]|i[3579]-|ryzen|pentium|celeron|xeon|athlon|dual core|core 2)\b/.test(text)) {
      if (/\b(ryzen|amd|athlon|fx)\b/.test(text)) return "assets/parts/cpu-ryzen.webp";
      if (/\b(i7|i9|ultra 7|ultra 9|xeon)\b/.test(text)) return "assets/parts/cpu-i7.webp";
      if (/\b(i5|ultra 5)\b/.test(text)) return "assets/parts/cpu-i5.webp";
      if (/\b(i3|ultra 3)\b/.test(text)) return "assets/parts/cpu-i3.webp";
      return "assets/parts/cpu-intel.webp";
    }

    // 3. Motherboards
    if (sec === "motherboards" || /\b(board|motherboard|h61|h81|b75|h110|b250|h310|b365|h410|b460|h510|b560|h610|b660|b760|z\d{3}|a320|a520|b350|b450|b550|x370|x470|x570|x670)\b/.test(text)) {
      if (/\b(amd|a320|a520|b350|b450|b550|x370|x470|x570|x670|x870|am4|am5)\b/.test(text)) {
        return /\b(x570|x670|x870|b550)\b/.test(text) ? "assets/parts/mb-x870.webp" : "assets/parts/mb-amd.webp";
      }
      return /\b(z490|z590|z690|z790|z890)\b/.test(text) ? "assets/parts/mb-z890.webp" : "assets/parts/mb-intel.webp";
    }

    // 4. Storage
    if (sec === "storage" || /\b(nvme|m\.2|ssd|hdd|hard|sata|tb|gb)\b/.test(text) && !/\b(ram|ddr|gddr|vga)\b/.test(text)) {
      if (/\b(samsung|pro|heatsink|gen ?[45])\b/.test(text) && /\b(nvme|m\.2)\b/.test(text)) return "assets/parts/ssd-samsung.webp";
      if (/\b(nvme|m\.2)\b/.test(text)) return "assets/parts/ssd-nvme.webp";
      if (/\b(ssd|lexar|pny)\b/.test(text)) return /\b(120|128|240|256)\b/.test(text) ? "assets/parts/ssd-lexar.webp" : "assets/parts/ssd-sata.webp";
      return "assets/parts/hdd-35.webp";
    }

    // 5. RAM / Memory
    if (sec === "ram" || /\b(ddr[2345]|ram|so-dimm|sodimm|memory|vengeance)\b/.test(text)) {
      if (/\b(laptop|sodimm|so-dimm)\b/.test(text)) return "assets/parts/ram-laptop.webp";
      if (/\b(ddr5|rgb|heatsink|gaming|16gb|32gb)\b/.test(text)) return "assets/parts/ram-rgb.webp";
      if (/\b(ddr4)\b/.test(text)) return "assets/parts/ram-ddr4.webp";
      return "assets/parts/ram-desktop.webp";
    }

    // 6. Monitors
    if (sec === "monitors" || /\b(monitor|inch|curved|ips|oled|hz|frameless|display)\b/.test(text) && !/\b(hdmi|vga cable|dp)\b/.test(text)) {
      if (/\b(curved|32|34|ultra)\b/.test(text)) return "assets/parts/mon-curved.webp";
      if (/\b(27|144hz|165hz|200hz|240hz)\b/.test(text)) return "assets/parts/mon-27.webp";
      return "assets/parts/mon-24.webp";
    }

    // 7. Power Supply / UPS
    if (sec === "power-supply" || /\b(psu|power supply|ups|modular|bronze|gold|watts|500w|550w|650w|750w|850w|1000w)\b/.test(text)) {
      if (/\b(ups|va)\b/.test(text)) return "assets/parts/ups.webp";
      if (/\b(modular|gold|platinum|750w|850w|1000w|1200w)\b/.test(text)) return "assets/parts/psu-gold.webp";
      if (/\b(600w|650w|msi)\b/.test(text)) return "assets/parts/psu-msi.webp";
      return "assets/parts/psu-bronze.webp";
    }

    // 8. Cooling
    if (sec === "cooling" || /\b(cooler|fan|liquid|aio|paste|pad|argb|rgb fan|heatsink)\b/.test(text)) {
      if (/\b(liquid|aio|240mm|360mm|water)\b/.test(text)) return "assets/parts/cool-aio.webp";
      if (/\b(paste|grease|pad)\b/.test(text)) return "assets/parts/cool-paste.webp";
      return "assets/parts/cool-fan.webp";
    }

    // 9. Peripherals & Brand New Sections
    if (sec === "bn-combos" || /\b(combo|keyboard.*mouse|mouse.*keyboard)\b/.test(text)) {
      return "assets/parts/combo-gaming.webp";
    }
    if (sec === "bn-mice" || /\b(mouse|g102|ms111|jedel 220|x500|x1|op-10|op-40)\b/.test(text)) {
      if (/\b(game|gaming|g102|op-40|x1)\b/.test(text)) return "assets/parts/mouse-logi.webp";
      if (/\b(wireless|w\/l)\b/.test(text)) return "assets/parts/mouse-razer.webp";
      return "assets/parts/mouse-rog.webp";
    }
    if (sec === "bn-keyboards" || /\b(keyboard|banda|helios|ps2 keyboard|flexible)\b/.test(text)) {
      if (/\b(gaming|rgb|v2|v3)\b/.test(text)) return "assets/parts/kb-apex.webp";
      if (/\b(wireless|wriless|mini|multimedia|v5)\b/.test(text)) return "assets/parts/kb-retro.webp";
      return "assets/parts/kb-tuf.webp";
    }
    if (sec === "bn-webcams" || /\b(webcam|web camera|720p|1080p|m928)\b/.test(text)) {
      return /\b(1080|4k|hdr)\b/.test(text) ? "assets/parts/webcam-brio.webp" : "assets/parts/webcam-fhd.webp";
    }
    if (sec === "bn-microphones" || /\b(mic|microphone|tucci)\b/.test(text)) {
      return /\b(rgb|gaming|studio)\b/.test(text) ? "assets/parts/mic-rgb.webp" : "assets/parts/mic-rog.webp";
    }
    if (sec === "bn-sound-cards" || /\b(sound card|headset|speaker|audio|5\.1|7\.1)\b/.test(text)) {
      return /\b(pci|express)\b/.test(text) ? "assets/parts/sound-usb.webp" : "assets/parts/headset-tuf.webp";
    }
    if (sec === "cables" || /\b(cable|hdmi|vga|dp|displayport|hub|converter|adapter|power cord|sata|extension)\b/.test(text)) {
      if (/\b(hub|type-c|usb)\b/.test(text)) return "assets/parts/cable-hub.webp";
      if (/\b(dp|display|converter|vga)\b/.test(text)) return "assets/parts/cable-dp.webp";
      return "assets/parts/cable-hdmi.webp";
    }

    // 10. Boxed PC Components fallback inside bn-components
    if (sec === "bn-components") {
      if (/\b(cpu|processor|core|ryzen)\b/.test(text)) return "assets/parts/cpu-i7.webp";
      if (/\b(motherboard)\b/.test(text)) return "assets/parts/mb-z890.webp";
      if (/\b(ssd|nvme)\b/.test(text)) return "assets/parts/ssd-samsung.webp";
      if (/\b(gpu|vga|rtx|rx)\b/.test(text)) return "assets/parts/gpu-rtx-triple.webp";
      if (/\b(ram|memory)\b/.test(text)) return "assets/parts/ram-rgb.webp";
      if (/\b(psu|power)\b/.test(text)) return "assets/parts/psu-gold.webp";
    }

    // Fallback by section ID
    const secDefaults = {
      monitors: "assets/parts/mon-24.webp",
      "vga-cards": "assets/parts/gpu-gtx.webp",
      processors: "assets/parts/cpu-i5.webp",
      motherboards: "assets/parts/mb-intel.webp",
      storage: "assets/parts/ssd-nvme.webp",
      ram: "assets/parts/ram-ddr4.webp",
      "power-supply": "assets/parts/psu-bronze.webp",
      cooling: "assets/parts/cool-fan.webp",
      cables: "assets/parts/cable-hdmi.webp",
      peripherals: "assets/parts/mouse-rog.webp",
      "bn-components": "assets/parts/mb-z890.webp",
    };
    return secDefaults[sec] || "assets/parts/gpu-prime.webp";
  };
})();
