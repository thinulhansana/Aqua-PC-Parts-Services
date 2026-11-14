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

  // Distinct verified internet product photo URLs per catalog item ID (364 items)
  const ITEM_IMAGES = {
    "17-lcd": "https://ts1.mm.bing.net/th?id=OIP.XhLmUTVQAJw4L7cud2UiogHaHa&pid=15.1&w=400&h=400&c=7",
    "19-lcd": "https://ts2.mm.bing.net/th?id=OIP.OH7A9tkbheUsQ3YOXegTbAHaHa&pid=15.1&w=400&h=400&c=7",
    "20-lcd": "https://ts3.mm.bing.net/th?id=OIP.DM385e5vPoTIlX5exQjFKwHaHa&pid=15.1&w=400&h=400&c=7",
    "19-wide-lcd": "https://ts3.mm.bing.net/th?id=OIP.2m6ogjmLtKy9aRecTFwlvwHaHa&pid=15.1&w=400&h=400&c=7",
    "20-wide-lcd": "https://ts1.mm.bing.net/th?id=OIP.QPPSoLgVTFxAINp37a-xswHaEv&pid=15.1&w=400&h=400&c=7",
    "21-wide-lcd": "https://ts4.mm.bing.net/th?id=OIP.WUi3yn8djykVnICzAV3CoAHaHa&pid=15.1&w=400&h=400&c=7",
    "22-wide-lcd": "https://ts1.mm.bing.net/th?id=OIP.c0GKtZ_XacVr1kg0IdkiTAHaHa&pid=15.1&w=400&h=400&c=7",
    "22-wide-lcd-hdmi": "https://ts4.mm.bing.net/th?id=OIP.zjyOfK7ky5XhsIg2N23-6wHaHa&pid=15.1&w=400&h=400&c=7",
    "24-wide-lcd": "https://ts2.mm.bing.net/th?id=OIP.eEru15AKK5QV1Bq8W-IskQHaGv&pid=15.1&w=400&h=400&c=7",
    "24-wide-lcd-hdmi": "https://ts3.mm.bing.net/th?id=OIP.J83EYbazaQuQDK6Y5y_K3QHaHa&pid=15.1&w=400&h=400&c=7",
    "17-led": "https://ts3.mm.bing.net/th?id=OIP.o8AkgF3NHUCMZHpS4VKR-gHaIT&pid=15.1&w=400&h=400&c=7",
    "19-led": "https://ts2.mm.bing.net/th?id=OIP.vv3QUkXLWF0bgALlsBbCyAHaHl&pid=15.1&w=400&h=400&c=7",
    "20-led": "https://ts2.mm.bing.net/th?id=OIP.-6n8QeoURgwrdbBdR8qO4QHaGr&pid=15.1&w=400&h=400&c=7",
    "19-wide-led": "https://ts2.mm.bing.net/th?id=OIP.75dRUKfNthpEjuRMiaf2QwHaHa&pid=15.1&w=400&h=400&c=7",
    "20-wide-led": "https://ts1.mm.bing.net/th?id=OIP.ST0sOQhTwRyrrIiqn7OcIgHaHa&pid=15.1&w=400&h=400&c=7",
    "20-wide-led-hdmi": "https://ts4.mm.bing.net/th?id=OIP.TcfhISVCLwlKq9h1tozwFwHaHa&pid=15.1&w=400&h=400&c=7",
    "21-wide-led": "https://ts2.mm.bing.net/th?id=OIP.Z6cB2LNYu--YBGRhzdhCyQHaHa&pid=15.1&w=400&h=400&c=7",
    "22-wide-led": "https://ts1.mm.bing.net/th?id=OIP.HTAWv5MnDTCVLyyECy_KTgHaE8&pid=15.1&w=400&h=400&c=7",
    "22-wide-led-hdmi": "https://ts4.mm.bing.net/th?id=OIP.DwuWnfp2OBQe-4u3rBw2dgHaGn&pid=15.1&w=400&h=400&c=7",
    "23-wide-led": "https://ts2.mm.bing.net/th?id=OIP.irWek9ILFmzSr08bHrb3qAHaHa&pid=15.1&w=400&h=400&c=7",
    "23-wide-led-hdmi": "https://ts3.mm.bing.net/th?id=OIP.nH7PqHTKytwm0QYwyTOMLQHaF2&pid=15.1&w=400&h=400&c=7",
    "23-wide-led-hdmi-ips": "https://ts3.mm.bing.net/th?id=OIP.DD7v-FQ1GkDNffgyuHGx-gHaGp&pid=15.1&w=400&h=400&c=7",
    "24-wide-led": "https://ts1.mm.bing.net/th?id=OIP.Hs9Q9IIN251uumYBynzUVQHaHa&pid=15.1&w=400&h=400&c=7",
    "24-wide-led-hdmi": "https://ts2.mm.bing.net/th?id=OIP.2fZS6GpEdsUUBoJoNPeY_AHaEo&pid=15.1&w=400&h=400&c=7",
    "22-fhd-ips": "https://ts2.mm.bing.net/th?id=OIP.5iV3XeOcfFfpVP18NKrImAHaHa&pid=15.1&w=400&h=400&c=7",
    "23-fhd-ips": "https://ts4.mm.bing.net/th?id=OIP.lQQO7S2FhVYYLAS1IVKVaAHaE6&pid=15.1&w=400&h=400&c=7",
    "24-fhd-ips": "https://ts4.mm.bing.net/th?id=OIP.WGwRxosp6k1wCOtWwVISEAHaIC&pid=15.1&w=400&h=400&c=7",
    "vga-512mb-pci-ex": "https://ts1.mm.bing.net/th?id=OIP.a74xF9lpkDMW8SzIlsSurgHaG4&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-pci-ex": "https://ts3.mm.bing.net/th?id=OIP.YB2dwUPu-xNhIlkltmvn9gHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-pci-ex-dx11": "https://ts4.mm.bing.net/th?id=OIP.ZyN9HLh36X5AJf6mcV9d5QHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-pci-ex": "https://ts2.mm.bing.net/th?id=OIP.tENdh9WzL0eMG73m4d6scQHaHZ&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-ati-hd5000": "https://ts2.mm.bing.net/th?id=OIP.JhZlCLAf5gCBKcRnHds7hQAAAA&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-ati-hd6000": "https://ts2.mm.bing.net/th?id=OIP.k5Du7sw5ZMY0vuEunPhZzQHaE4&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-ati-hd7000": "https://ts2.mm.bing.net/th?id=OIP.JBKpBPc6JeADRmmVF6v-JAHaHQ&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-gts450": "https://ts1.mm.bing.net/th?id=OIP.Wfmeq_MwPfqmRPhnHaWEIwAAAA&pid=15.1&w=400&h=400&c=7",
    "vga-768mb-gtx460": "https://ts3.mm.bing.net/th?id=OIP.2m1gq2cCWg26HWrU_D_GqwHaF7&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-gtx460": "https://ts4.mm.bing.net/th?id=OIP.vUVdMcLGGZtfmGywv4clDAHaF_&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-gtx550": "https://ts2.mm.bing.net/th?id=OIP.92WCuQd9lO2qzRILlcZSbgHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-gtx550ti": "https://ts2.mm.bing.net/th?id=OIP.o3YGk_Ok5_ZcA0oE09oP6AHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-gtx560": "https://ts3.mm.bing.net/th?id=OIP.gzUzoSeF6PifGXyJj6gUPwHaEK&pid=15.1&w=400&h=400&c=7",
    "vga-1gb-gtx560ti": "https://ts2.mm.bing.net/th?id=OIP.tObgLoBrX9ChikwfJWi9RQHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx550ti": "https://ts2.mm.bing.net/th?id=OIP.Jfok7WhTMad9-tSwaAyHWwHaF1&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx650": "https://ts1.mm.bing.net/th?id=OIP.9olFwkkFiB03hf1MU1hssgHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx650ti": "https://ts3.mm.bing.net/th?id=OIP.0iMbd9nxBgM4X_A7jS6dHgHaFT&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx660": "https://ts2.mm.bing.net/th?id=OIP.B334Bmt1HcacBkPdq84qLAHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx660ti": "https://ts1.mm.bing.net/th?id=OIP.jKui2vgwcb5idMnhUHZrNwHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx750ti": "https://ts1.mm.bing.net/th?id=OIP.p94NPy_S2TqEScr3dCLvogHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx760": "https://ts2.explicit.bing.net/th?id=OIP.8uoaH55OmgzL5gFd0EocdgHaGA&pid=15.1&w=400&h=400&c=7",
    "vga-2gb-gtx770": "https://ts4.mm.bing.net/th?id=OIP.rlkLHxWeMZxSl_Dz6Fj6BAHaHU&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-gtx960": "https://ts4.mm.bing.net/th?id=OIP.m1AqPRgYIQukCAOWgn6lJgHaF7&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-gtx970": "https://ts3.mm.bing.net/th?id=OIP.-YdllPkQubhyLscgI6U7bQHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-gtx980": "https://ts3.mm.bing.net/th?id=OIP.qRV0O7NMwYgeJg0tDxDcRwHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-gtx980ti": "https://ts3.mm.bing.net/th?id=OIP.Xofe-EiQe0TGF9E4jPVzpgHaF7&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-gtx1050ti": "https://ts4.mm.bing.net/th?id=OIP.A1KCjeuwHMRFSA4cUZOCdAHaF7&pid=15.1&w=400&h=400&c=7",
    "vga-6gb-gtx1060": "https://ts3.mm.bing.net/th?id=OIP.Q57K2ZPAgR281MZMGgpNBgHaGF&pid=15.1&w=400&h=400&c=7",
    "vga-6gb-gtx1060-super": "https://ts3.mm.bing.net/th?id=OIP.9xHvUyPpsyicakqWyORYmAHaFc&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-gtx1070": "https://ts4.mm.bing.net/th?id=OIP.dsuNkIYIbeXhNf7cVpokpAHaGb&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-gtx1070ti": "https://ts3.mm.bing.net/th?id=OIP.tx6qdYdv_XVvguQRCoFVmQHaGc&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-gtx1070-super": "https://ts3.mm.bing.net/th?id=OIP.b_l2FWqxax-vOcOh0gtx0gHaHX&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-gtx1080": "https://ts1.mm.bing.net/th?id=OIP.K-2o-LgB7zBUwpPSOf10OwHaHC&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-gtx1080-super": "https://ts1.mm.bing.net/th?id=OIP.Y8v70IsnoboU7yLsmcK3SAHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-11gb-gtx1080ti": "https://ts3.mm.bing.net/th?id=OIP.k7-8bmIuNnwFTvNkRG5hOAHaHd&pid=15.1&w=400&h=400&c=7",
    "vga-6gb-gtx1660-super": "https://ts2.mm.bing.net/th?id=OIP.qWxXr78bzq1NNvmcdKJaSwHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-6gb-gtx1660ti": "https://ts1.mm.bing.net/th?id=OIP.DRhlbrHk_9YYBhuKYnwqZQHaF7&pid=15.1&w=400&h=400&c=7",
    "vga-6gb-rtx2060": "https://ts3.mm.bing.net/th?id=OIP.CzTseD1abLwCStoDPPzIJQHaHR&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx2060": "https://ts2.mm.bing.net/th?id=OIP.nfT4RUQcubfSJTUzySpxAgHaFu&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx2070": "https://ts4.mm.bing.net/th?id=OIP.aGm2i86vTXxq7AWt4Q1IeAHaFe&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx2080": "https://ts3.mm.bing.net/th?id=OIP.iRyFNLSp1uIk-dDyuLcPxwHaFj&pid=15.1&w=400&h=400&c=7",
    "vga-11gb-rtx2080ti": "https://ts3.mm.bing.net/th?id=OIP.jXt72tn_xIZ1mwy8IYVlOQHaG5&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx3050": "https://ts3.mm.bing.net/th?id=OIP.OJtODEDXhhMrq0dR_7X70AHaE7&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx3060ti": "https://ts2.mm.bing.net/th?id=OIP.AjTJjn4ZwScUa7bXaNqaigHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx3070": "https://ts2.mm.bing.net/th?id=OIP.GQ_62vfwMQz-DNdF6o6xlwHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx3070ti": "https://ts1.mm.bing.net/th?id=OIP.NbLfMI0hnAGJMS3qY0p6QwHaH0&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rtx3070ti-super": "https://ts1.mm.bing.net/th?id=OIP.fgqiqNGYggtW5OXo0Q8qxwHaHs&pid=15.1&w=400&h=400&c=7",
    "vga-12gb-rtx3060": "https://ts4.mm.bing.net/th?id=OIP.M8Flz698B2vIGOMSLMXBjgHaGp&pid=15.1&w=400&h=400&c=7",
    "vga-12gb-rtx3060ti": "https://ts2.mm.bing.net/th?id=OIP.rdQsvnda5RCk0YXARVOB7AHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-12gb-rtx3080ti": "https://ts3.mm.bing.net/th?id=OIP.R50dfCG0O5soXs5eJ2cWUQHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-12gb-rtx4060ti": "https://ts1.mm.bing.net/th?id=OIP.YkZBZc3G9LKTi0lS00KuRgHaHt&pid=15.1&w=400&h=400&c=7",
    "vga-12gb-rtx4070-super": "https://ts1.mm.bing.net/th?id=OIP.vj8_r2bQFl2a9LJIkHrF4wHaGy&pid=15.1&w=400&h=400&c=7",
    "vga-12gb-rtx4070ti": "https://ts2.mm.bing.net/th?id=OIP.EvOF5-KVF21zL4bkqUvHtgHaGk&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-rx470": "https://ts2.mm.bing.net/th?id=OIP.qXiEX0dTDXxJ9umz7T8qcgHaFc&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-rx480": "https://ts1.explicit.bing.net/th?id=OIP.ehorJoYxEWddhVVjm1IE9AHaFj&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-rx570": "https://ts1.mm.bing.net/th?id=OIP.acS5VA0lirShWOfL7CqnLQHaIQ&pid=15.1&w=400&h=400&c=7",
    "vga-8gb-rx570": "https://ts3.mm.bing.net/th?id=OIP.LQP9X3kJPc9vN6e2jOMosgHaGr&pid=15.1&w=400&h=400&c=7",
    "vga-4gb-rx580": "https://ts4.mm.bing.net/th?id=OIP.w3rD4Hh_t1YZhP-kiwfU-gHaG4&pid=15.1&w=400&h=400&c=7",
    "vga-rx5500xt-4gb": "https://ts4.mm.bing.net/th?id=OIP.AKGr1L7NRbBVYSG76lugxwHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-rx6500xt-4gb": "https://ts1.mm.bing.net/th?id=OIP.Q215jK8uBvidsBnyNNcZwQHaF5&pid=15.1&w=400&h=400&c=7",
    "vga-rx5600xt-6gb": "https://ts3.mm.bing.net/th?id=OIP.1-YRG2wYMHm1jq93VDdN2gHaHa&pid=15.1&w=400&h=400&c=7",
    "vga-rx5500xt-8gb": "https://ts1.explicit.bing.net/th?id=OIP.8kO-41-CPZNj6p2RTX3W-wHaF7&pid=15.1&w=400&h=400&c=7",
    "vga-rx5700xt-8gb": "https://ts1.mm.bing.net/th?id=OIP.Vz2nDz43Mx3P0icShlIpagHaHX&pid=15.1&w=400&h=400&c=7",
    "vga-rx6600-8gb": "https://ts1.mm.bing.net/th?id=OIP.Igvk3ARRyUHxIhcehcEkJAHaIA&pid=15.1&w=400&h=400&c=7",
    "vga-rx7600xt-8gb": "https://ts3.mm.bing.net/th?id=OIP.MiB6eiewzbMXh7TkgpkMtAHaHa&pid=15.1&w=400&h=400&c=7",
    "i3-530-293": "https://ts1.mm.bing.net/th?id=OIP.k4aSFHYE1X7HNdfqifQ8uwHaHc&pid=15.1&w=400&h=400&c=7",
    "i3-540-306": "https://ts4.mm.bing.net/th?id=OIP.KPb7yBqnGRAmKX92njqHEwHaIT&pid=15.1&w=400&h=400&c=7",
    "i3-550-320": "https://ts4.mm.bing.net/th?id=OIP.n7EqOLbsyUIeK43SmRmHPwHaIY&pid=15.1&w=400&h=400&c=7",
    "i3-2100-310": "https://ts3.mm.bing.net/th?id=OIP.sXlECw4PDK6OUCRxsa7grgAAAA&pid=15.1&w=400&h=400&c=7",
    "i3-2120-330": "https://ts4.mm.bing.net/th?id=OIP.YNA42lNxO4Y3gAo7NLYSLgHaHS&pid=15.1&w=400&h=400&c=7",
    "i3-2130-340": "https://ts1.mm.bing.net/th?id=OIP.albsyw3GfBOxyi5KV_RxIgHaIe&pid=15.1&w=400&h=400&c=7",
    "i3-3210-320": "https://ts1.mm.bing.net/th?id=OIP.-IvarUgrNWQ3_OoTmbcUsAHaHa&pid=15.1&w=400&h=400&c=7",
    "i3-3220-330": "https://ts3.mm.bing.net/th?id=OIP.3LNN0D_gYVI8BEJUEwoaKAHaHY&pid=15.1&w=400&h=400&c=7",
    "i3-3240-340": "https://ts2.mm.bing.net/th?id=OIP.kfRWPVTM5OTzeLuanNNodAHaG_&pid=15.1&w=400&h=400&c=7",
    "i3-3250-350": "https://ts3.mm.bing.net/th?id=OIP.1tCzcW4dDHCjQ71E5MeKvQAAAA&pid=15.1&w=400&h=400&c=7",
    "i3-4130-340": "https://ts2.mm.bing.net/th?id=OIP.Ft_KqX0roR2gnREFyT1WRAHaHa&pid=15.1&w=400&h=400&c=7",
    "i3-4150-350": "https://ts2.mm.bing.net/th?id=OIP.ISAZ0ZQOwRSKyprSXxHMYgHaHa&pid=15.1&w=400&h=400&c=7",
    "i3-4160-360": "https://ts2.mm.bing.net/th?id=OIP.9aj3CieQBf8N4Ji5t2RK1QHaJY&pid=15.1&w=400&h=400&c=7",
    "i3-4170-370": "https://ts1.mm.bing.net/th?id=OIP.zjk81v97mkvDZUOknShoKwHaHa&pid=15.1&w=400&h=400&c=7",
    "i3-6100-370": "https://ts3.mm.bing.net/th?id=OIP.JciofWtYN8UZheLuv78GLAHaFv&pid=15.1&w=400&h=400&c=7",
    "i3-7100-390": "https://ts3.mm.bing.net/th?id=OIP.vWOopYZ8xUjh-RakOqS57AHaHD&pid=15.1&w=400&h=400&c=7",
    "i3-8100-360": "https://ts4.mm.bing.net/th?id=OIP.6OZiPv3Q9guzpPO5AwphNwHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-650-320": "https://ts1.mm.bing.net/th?id=OIP.IydG1DfWcBPeXg_bwOhA_AHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-660-330": "https://ts4.mm.bing.net/th?id=OIP.hqd5HXu2RY1B2ojW502ozgHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-750-266": "https://ts3.mm.bing.net/th?id=OIP.bO0oRg7hJmWyyehq8oGEdwAAAA&pid=15.1&w=400&h=400&c=7",
    "i5-760-280": "https://ts3.mm.bing.net/th?id=OIP.zXUc01w2NfB8xdQ5ZTEqdgHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-2300-280": "https://ts2.mm.bing.net/th?id=OIP.DtpZapnwwaleEQnlsuoq7QHaH2&pid=15.1&w=400&h=400&c=7",
    "i5-2320-300": "https://ts4.mm.bing.net/th?id=OIP.ELkyeIZ5iHQr7mFzXB6F8AHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-2400-310": "https://ts1.mm.bing.net/th?id=OIP.A_qT2NAjNlOeWn8fL_PmQQHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-2500-330": "https://ts2.mm.bing.net/th?id=OIP.qHBJRiGbBr4En3EHsNzLtgHaJY&pid=15.1&w=400&h=400&c=7",
    "i5-3330-300": "https://ts4.mm.bing.net/th?id=OIP.tR3CLvnfOohqae5rBbZQMgHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-3450-310": "https://ts3.mm.bing.net/th?id=OIP.vRi3tiWJKPe65rIybrb8BQHaHN&pid=15.1&w=400&h=400&c=7",
    "i5-3470-320": "https://ts3.mm.bing.net/th?id=OIP.argLbh5m1Xw-0EQB3XpV8wHaF4&pid=15.1&w=400&h=400&c=7",
    "i5-3550-330": "https://ts2.mm.bing.net/th?id=OIP.dvJ0BiSI7ZMvIXG5THhWNAHaFj&pid=15.1&w=400&h=400&c=7",
    "i5-3570-340": "https://ts2.mm.bing.net/th?id=OIP.2W2D0h6W5jdIL5jKThoJjAHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-4430-300": "https://ts2.mm.bing.net/th?id=OIP.yI85lKn2nCX4Q9EFhUirpwHaHU&pid=15.1&w=400&h=400&c=7",
    "i5-4440-320": "https://ts2.mm.bing.net/th?id=OIP._-BS7eXK_7tBFbdF4e1I7AHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-4460-320": "https://ts2.mm.bing.net/th?id=OIP.KKbHOtCmoWKCCAVU-CB1XgHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-4570-320": "https://ts3.mm.bing.net/th?id=OIP.DJyeK8q68fUGfCFMVeXF4QHaHQ&pid=15.1&w=400&h=400&c=7",
    "i5-4590-330": "https://ts1.mm.bing.net/th?id=OIP.S0bV5QYRG8kqxNLnY45x8QHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-4670-340": "https://ts2.mm.bing.net/th?id=OIP.iAfRCBYrw6ZQiuXJLLud5wHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-4690-350": "https://ts2.mm.bing.net/th?id=OIP.giSZ4olqB-iULXMRUDYq0wHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-6400-270": "https://ts4.mm.bing.net/th?id=OIP.345oPzuTbIelOTf-0OxI7AHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-6500-320": "https://ts4.mm.bing.net/th?id=OIP.fV-HYtgQ6AcsxwHW49XdiwAAAA&pid=15.1&w=400&h=400&c=7",
    "i5-6600-330": "https://ts3.mm.bing.net/th?id=OIP.jbkig516Upa_iYhIH8fkLQHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-7400-300": "https://ts2.mm.bing.net/th?id=OIP.2UOcYDPoN4qYxYXFAWNV5AAAAA&pid=15.1&w=400&h=400&c=7",
    "i5-7500-340": "https://ts4.mm.bing.net/th?id=OIP.41gWG0kmPcaSTyIbEjsdyAHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-7600-350": "https://ts3.mm.bing.net/th?id=OIP.diH94NMeMuWHqnGUxLhpMwHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-8400-280": "https://ts3.mm.bing.net/th?id=OIP.kET3eBx5GfIdviY5wH-gmQHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-8600-310": "https://ts3.mm.bing.net/th?id=OIP.wPndMYRfllpu5d6fByZVTQHaHa&pid=15.1&w=400&h=400&c=7",
    "i5-9400f-290": "https://ts1.mm.bing.net/th?id=OIP.soPSSGMoRVT8Swq0KwmNTgHaHV&pid=15.1&w=400&h=400&c=7",
    "i7-860-280": "https://ts3.mm.bing.net/th?id=OIP.j8UwhE4LyO7PffR8vZY_KgHaHK&pid=15.1&w=400&h=400&c=7",
    "i7-870-293": "https://ts4.mm.bing.net/th?id=OIP._RB4vkFWG_vN6t4gwFE_9wHaJb&pid=15.1&w=400&h=400&c=7",
    "i7-920-266": "https://ts4.mm.bing.net/th?id=OIP.v2CyTOWVhhDyjDH7SHeSHAHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-950-306": "https://ts3.mm.bing.net/th?id=OIP.NTHSrlfXS6bVWf_WEYGEywHaIi&pid=15.1&w=400&h=400&c=7",
    "i7-2600-340": "https://ts1.mm.bing.net/th?id=OIP.VVWsLAdpLBOwJLw2kUAx7wHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-3770-340": "https://ts1.mm.bing.net/th?id=OIP.3pR5gq8wKbCrrBcFNsnJpQHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-4770-340": "https://ts1.mm.bing.net/th?id=OIP.DTngpcXkFoJ83gY12HDepQHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-4790-360": "https://ts3.mm.bing.net/th?id=OIP.dhPuU6Y-YXVfgN7L2Eyn3QHaHY&pid=15.1&w=400&h=400&c=7",
    "i7-6700-340": "https://ts4.mm.bing.net/th?id=OIP.TEJSVu_qOoSaMHBK8ESAVgHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-6800k-360": "https://ts4.mm.bing.net/th?id=OIP.8M3YxTJoBsBfOR5cFULdCAHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-7700-360": "https://ts3.mm.bing.net/th?id=OIP._4ncaoGKvSpvgMQPKhwBugHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-8700-320": "https://ts1.mm.bing.net/th?id=OIP.unXtSoq1Q7k4COwQou3hAAHaHa&pid=15.1&w=400&h=400&c=7",
    "i7-9700-300": "https://ts1.mm.bing.net/th?id=OIP.Ubm5yqnEINZ8iyXW1B-izwHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-1600": "https://ts4.mm.bing.net/th?id=OIP.s00SvMhnwXAHzbGR0x5v2AHaH5&pid=15.1&w=400&h=400&c=7",
    "amd-r3-2200g": "https://ts4.mm.bing.net/th?id=OIP.Gd6M42xsoAJ1usnkthSHswHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r3-3200g": "https://ts2.mm.bing.net/th?id=OIP.WLGP46TxJHDUdVpxrhfIuwHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-2400g": "https://ts1.mm.bing.net/th?id=OIP.kYut_DZmg0eum6swfgifEgHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-2600": "https://ts2.mm.bing.net/th?id=OIP.U538kfdvg4UHYUDJKex2EgHaGZ&pid=15.1&w=400&h=400&c=7",
    "amd-r5-2600x": "https://ts2.mm.bing.net/th?id=OIP.uVvj55m5ypP6Yu6wCA7KqAHaE8&pid=15.1&w=400&h=400&c=7",
    "amd-r5-3200g": "https://ts2.mm.bing.net/th?id=OIP.LUlL0kX0nVsNZx-kocZylAHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-3400g": "https://ts2.mm.bing.net/th?id=OIP.JmJPEFXDJg645DGs2KOKEgHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-3500": "https://ts2.mm.bing.net/th?id=OIP.Hb-ZG5XEjO13lNkWRKM5sgHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-3500x": "https://ts2.mm.bing.net/th?id=OIP.tKI0lKeSUAeRIvjZI2VaywHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-3600": "https://ts4.mm.bing.net/th?id=OIP.WCp6pyPTL5IHhP059491DAHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-4600g": "https://ts2.mm.bing.net/th?id=OIP.TvukQxvyODS5X3jROZUyYgHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-5600": "https://ts1.mm.bing.net/th?id=OIP.y9UM8I1W5G4xGr3qu9uIpQHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r5-5600x": "https://ts2.mm.bing.net/th?id=OIP.mjbqvo5JMnGu4JzlgzXZIAHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r7-1700": "https://ts3.mm.bing.net/th?id=OIP.JGBkH0ugvSHRKx2j3BIsWQAAAA&pid=15.1&w=400&h=400&c=7",
    "amd-r7-1700x": "https://ts4.mm.bing.net/th?id=OIP.CHCOjWTrjCE84S5wYTrkfAHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r7-1800x": "https://ts1.mm.bing.net/th?id=OIP.9m6y-KXdfnMPJOMDkBmncAHaGO&pid=15.1&w=400&h=400&c=7",
    "amd-r7-2700": "https://ts4.mm.bing.net/th?id=OIP.8CEW3KKP_wk46JAbyfkiQAHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r7-2700x": "https://ts3.mm.bing.net/th?id=OIP.kNu1dcSZ3C9CwFYhIBG9ZwHaE8&pid=15.1&w=400&h=400&c=7",
    "amd-r7-3700": "https://ts1.mm.bing.net/th?id=OIP.mXM5p-lyWBaw4PQJ6_BLmAHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r7-3700x": "https://ts2.mm.bing.net/th?id=OIP.KKpMyqN0YQRACoKx6XfCEgHaLH&pid=15.1&w=400&h=400&c=7",
    "amd-r7-5700x": "https://ts1.mm.bing.net/th?id=OIP.U_2IowIQZ2rY8N87n_aYmQHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r7-5800x": "https://ts1.mm.bing.net/th?id=OIP.kT3PqsFXN7sesWN5bNkHNQHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r9-3900": "https://ts1.mm.bing.net/th?id=OIP.fFCx_QrS6_xrlWS3RUPeewHaFj&pid=15.1&w=400&h=400&c=7",
    "amd-r9-3900x": "https://ts3.mm.bing.net/th?id=OIP.sPlvxuc1Nbh1bMhCEgyYGgHaHa&pid=15.1&w=400&h=400&c=7",
    "amd-r9-5900x": "https://ts3.mm.bing.net/th?id=OIP.XmCaqKQEG8krcPqUlUPqFAHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-g41-ddr3": "https://ts2.mm.bing.net/th?id=OIP.RU2RnQtknV9FJHqZkDYexgHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-g41-ddr3-8gb": "https://ts2.mm.bing.net/th?id=OIP.aCMqYOi9t36iD23WJZ6CLgHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-p55-d3-1st": "https://ts2.mm.bing.net/th?id=OIP.8TSsbPmKjE8OoE-rALU0WAHaI7&pid=15.1&w=400&h=400&c=7",
    "mb-x58-d3-1st": "https://ts4.mm.bing.net/th?id=OIP.QdjtHQX-lZPINttIu8nkKQHaGH&pid=15.1&w=400&h=400&c=7",
    "mb-h61-d3-2nd": "https://ts3.mm.bing.net/th?id=OIP.-qlbFplvjBpHa6PX-YlDZwHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-p61-d3-3rd": "https://ts4.mm.bing.net/th?id=OIP.mUpL93pLYn6OZ5F3kw4C6wHaLN&pid=15.1&w=400&h=400&c=7",
    "mb-h61-d3-3rd": "https://ts4.mm.bing.net/th?id=OIP.NV9QdFMtY7nnTak46qcc3gHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h67-d3-2nd": "https://ts2.mm.bing.net/th?id=OIP.LKZUSKII7Qann82oh_NRKwHaI6&pid=15.1&w=400&h=400&c=7",
    "mb-p67-d3-sep-2nd": "https://ts4.mm.bing.net/th?id=OIP.gCP6ZSDOsv6Q8ocK1qpYAQHaKD&pid=15.1&w=400&h=400&c=7",
    "mb-h67-d3-3rd": "https://ts1.mm.bing.net/th?id=OIP.r937KujP0y1jFvA_ucgFqAHaEL&pid=15.1&w=400&h=400&c=7",
    "mb-p67-d3-sep-3rd": "https://ts3.mm.bing.net/th?id=OIP.NH3G3FSPIMqrGs3RCsSV1wHaI4&pid=15.1&w=400&h=400&c=7",
    "mb-z68-d3": "https://ts1.mm.bing.net/th?id=OIP.AdZI0jZoJtw0lshyM1f8RgHaG-&pid=15.1&w=400&h=400&c=7",
    "mb-b75-d3": "https://ts2.mm.bing.net/th?id=OIP.kNxoEs2HdM0EP_yVld0UEgHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-b75-d3-gaming": "https://ts1.mm.bing.net/th?id=OIP.YjAtntkjiS6btVkjw60S_AHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h77-d3": "https://ts2.mm.bing.net/th?id=OIP.mZzQJ_5J7T8T6DH7xh0anwHaFf&pid=15.1&w=400&h=400&c=7",
    "mb-z77-d3": "https://ts4.mm.bing.net/th?id=OIP.OaHL3tylwxJTVK4lA5rNzAHaFz&pid=15.1&w=400&h=400&c=7",
    "mb-h81-d3": "https://ts3.mm.bing.net/th?id=OIP.iX01I_6oqsg06QYPvVSQCwHaIK&pid=15.1&w=400&h=400&c=7",
    "mb-h81-d3-asus-msi": "https://ts4.mm.bing.net/th?id=OIP.UIHqzpQDkOUuHq0u3jZJZQHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-b85-d3": "https://ts3.mm.bing.net/th?id=OIP.ZPZfH-J-JRZLQt3jm-SPIwHaFj&pid=15.1&w=400&h=400&c=7",
    "mb-b85-d3-gaming": "https://ts4.mm.bing.net/th?id=OIP.Rmz79jt0E5FwMsSAcQ3qfgHaF1&pid=15.1&w=400&h=400&c=7",
    "mb-h87-d3": "https://ts4.mm.bing.net/th?id=OIP.qn5L6YrbdcWLabvlgXfRDQHaJf&pid=15.1&w=400&h=400&c=7",
    "mb-z87-d3": "https://ts4.mm.bing.net/th?id=OIP.o2ik3tmrdwrmgKcNIxs_EwHaFD&pid=15.1&w=400&h=400&c=7",
    "mb-h97-d3": "https://ts3.mm.bing.net/th?id=OIP.-u1oyaLa-5iMoOagpU0AuQHaKM&pid=15.1&w=400&h=400&c=7",
    "mb-z97-d3": "https://ts4.mm.bing.net/th?id=OIP.GsJG9FJpSuv3WLLBoy11DgHaE8&pid=15.1&w=400&h=400&c=7",
    "mb-x79-d3": "https://ts3.mm.bing.net/th?id=OIP.I43JYsmGG44ny0E7qSCVyAHaGn&pid=15.1&w=400&h=400&c=7",
    "mb-x99-d3": "https://ts3.mm.bing.net/th?id=OIP.1lAXJ58v7iuUxddMPSKjyQHaIr&pid=15.1&w=400&h=400&c=7",
    "mb-h110-d4d3": "https://ts3.mm.bing.net/th?id=OIP.Fijra9CZvj4V7TwGul_n5wHaIo&pid=15.1&w=400&h=400&c=7",
    "mb-h110-d4-m2": "https://ts1.mm.bing.net/th?id=OIP.5ZXEqMC4iZaxXPXaDFvqegHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h110-d4-asus": "https://ts4.mm.bing.net/th?id=OIP.fYxvn_F1rixlYHJaGOBKKAHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h110-d4-m2-asus": "https://ts4.mm.bing.net/th?id=OIP.JRaf_BaTYVUdwUmOcddUZAHaIf&pid=15.1&w=400&h=400&c=7",
    "mb-b150-d4": "https://ts2.mm.bing.net/th?id=OIP.L8EbY4ENzXGiRbcH3QL9ygHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-b150-d4-m2": "https://ts3.mm.bing.net/th?id=OIP.zNn-iqmbNthVYVra1lsVWwHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h170-d4": "https://ts3.mm.bing.net/th?id=OIP.EWb2kLkEJ8KBr9k6IOA1KAHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h170-d4-m2": "https://ts3.mm.bing.net/th?id=OIP.sm3Zz9nLbvynxGiyPh2EwgHaG0&pid=15.1&w=400&h=400&c=7",
    "mb-z170-d4-m2": "https://ts2.mm.bing.net/th?id=OIP.rNUboOx1yCg6psaNRfYJQAHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-b250-d4": "https://ts3.mm.bing.net/th?id=OIP.ffNnhR980MUEhT1wWDY53wHaJg&pid=15.1&w=400&h=400&c=7",
    "mb-b250-d4-m2": "https://ts3.mm.bing.net/th?id=OIP.chr2lnYsVKfbZ9ZWKT2A_AHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h270-d4": "https://ts3.mm.bing.net/th?id=OIP.2S4_wx2QGq1xW1VAS1trkAHaFj&pid=15.1&w=400&h=400&c=7",
    "mb-z270-d4": "https://ts2.mm.bing.net/th?id=OIP.Jxp5arReg55S-5mlj5knTgHaHE&pid=15.1&w=400&h=400&c=7",
    "mb-h310-d4": "https://ts4.mm.bing.net/th?id=OIP.hzXtgx18NzJdjClzqUeVFQHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h310-d4-m2": "https://ts2.mm.bing.net/th?id=OIP.zZ4L-gLdofavNwpdI7OqnAAAAA&pid=15.1&w=400&h=400&c=7",
    "mb-b360-d4-m2": "https://ts1.mm.bing.net/th?id=OIP.-YUS2ufzxX8jTrF4YkzdOAHaGm&pid=15.1&w=400&h=400&c=7",
    "mb-z370-d4-m2": "https://ts2.mm.bing.net/th?id=OIP.mxDtW2r1LcNgi-RgiIfuaAHaGX&pid=15.1&w=400&h=400&c=7",
    "mb-z390-d4-m2": "https://ts3.mm.bing.net/th?id=OIP.zVYn4uTPjtDWFgcT36rclQHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h410-d4": "https://ts3.mm.bing.net/th?id=OIP.cw8-d6Z_WLEJ9Cy-QmTF0AHaFK&pid=15.1&w=400&h=400&c=7",
    "mb-h410-d4-m2": "https://ts2.mm.bing.net/th?id=OIP.5UMd_mxLpgIBOlrmTgS_IAHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-b460-ddr4-m2": "https://ts3.mm.bing.net/th?id=OIP.YduL1Cd2_8mXON4skGrE5wHaJQ&pid=15.1&w=400&h=400&c=7",
    "mb-z490-ddr4-m2": "https://ts1.mm.bing.net/th?id=OIP.kinPMwK5dFfkf5knoGvKEgHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h510-ddr4": "https://ts2.mm.bing.net/th?id=OIP.sHzhxt5lCDnQ0N6Y1j-r-AHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-h510-ddr4-m2": "https://ts2.mm.bing.net/th?id=OIP.oRpUu9mMR4ORx7Gu1yvP3wHaHr&pid=15.1&w=400&h=400&c=7",
    "mb-b560-ddr4-m2": "https://ts1.mm.bing.net/th?id=OIP.-sGOjEnKKokB6EkNRBseDgHaHX&pid=15.1&w=400&h=400&c=7",
    "mb-h610-ddr4": "https://ts2.mm.bing.net/th?id=OIP.EX5cVlU3RsPs0Bd8y3xibQHaFj&pid=15.1&w=400&h=400&c=7",
    "mb-h610-ddr4-m2": "https://ts4.mm.bing.net/th?id=OIP.s12GawaN6Kc-oWXqsi07EQHaFI&pid=15.1&w=400&h=400&c=7",
    "mb-b660-ddr4-m2": "https://ts4.mm.bing.net/th?id=OIP.str6XTp7BUbUKpp7Pqt34QHaJX&pid=15.1&w=400&h=400&c=7",
    "mb-z690-ddr4-m2": "https://ts2.mm.bing.net/th?id=OIP.ecEh7AMLIu5bzuKFo2tKWQHaFM&pid=15.1&w=400&h=400&c=7",
    "mb-b760-ddr4-m2": "https://ts2.mm.bing.net/th?id=OIP.872BRNvT3QtlD7pbvaXlrgHaEi&pid=15.1&w=400&h=400&c=7",
    "mb-z790-ddr4-m2": "https://ts4.mm.bing.net/th?id=OIP.IuWEKbb9Oy7-8JCh7D3GSwHaKg&pid=15.1&w=400&h=400&c=7",
    "mb-amd-a320": "https://ts2.mm.bing.net/th?id=OIP.jaFvhS2f3AG9H7Y1u6L2eQHaF7&pid=15.1&w=400&h=400&c=7",
    "mb-amd-a320-m2": "https://ts4.mm.bing.net/th?id=OIP.n5b9A0MWQE9eNsOFN9_AAQHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-amd-a520": "https://ts2.mm.bing.net/th?id=OIP.9k4SLYLWWIFBQ5QewyJBdwHaII&pid=15.1&w=400&h=400&c=7",
    "mb-amd-a520-m2": "https://ts3.mm.bing.net/th?id=OIP.lpKYyfGEheUWnYDCsZ1IJgHaF7&pid=15.1&w=400&h=400&c=7",
    "mb-amd-x370-m2": "https://ts3.mm.bing.net/th?id=OIP.RYSLmdH9XISpwu4134oKJgHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-amd-x470-m2": "https://ts1.mm.bing.net/th?id=OIP.PfQSfQ5MvU2JFWiFc5mYHwHaJD&pid=15.1&w=400&h=400&c=7",
    "mb-amd-x570-m2": "https://ts4.mm.bing.net/th?id=OIP.BnwWjNdOIy_2LvwLqvp7LwHaEf&pid=15.1&w=400&h=400&c=7",
    "mb-amd-x670e": "https://ts1.mm.bing.net/th?id=OIP.iHvKPbNPCt6A9n9hwCh4ewHaFs&pid=15.1&w=400&h=400&c=7",
    "mb-amd-b350": "https://ts4.mm.bing.net/th?id=OIP.YpCe2D0XdhF5yxbhd7fjfQHaFj&pid=15.1&w=400&h=400&c=7",
    "mb-amd-b350-m2": "https://ts3.mm.bing.net/th?id=OIP.IiX503RuJ-eueAyxej41aQHaFb&pid=15.1&w=400&h=400&c=7",
    "mb-amd-b450": "https://ts1.mm.bing.net/th?id=OIP.nKwsG8SByHQd5uM9niG41AHaHa&pid=15.1&w=400&h=400&c=7",
    "mb-amd-b450-m2": "https://ts3.mm.bing.net/th?id=OIP.3jS0tSNl487k0Uu8oGbAsQHaFD&pid=15.1&w=400&h=400&c=7",
    "mb-amd-b550-m2": "https://ts4.mm.bing.net/th?id=OIP.ad2kTQkDF9_-NM64Rek8twHaD_&pid=15.1&w=400&h=400&c=7",
    "mb-amd-b650-m2": "https://ts1.mm.bing.net/th?id=OIP.SY_-iIUTkKw_3LMDCFC0YwHaFD&pid=15.1&w=400&h=400&c=7",
    "mb-amd-b850-m2": "https://ts2.mm.bing.net/th?id=OIP.Q7Yd44gbDjzsArUvKRk46wHaFZ&pid=15.1&w=400&h=400&c=7",
    "ssd-120-128gb": "https://ts4.mm.bing.net/th?id=OIP.31Eu_G2Mg3Z2l-ZjLuTBXwHaKN&pid=15.1&w=400&h=400&c=7",
    "ssd-120-128-samsung-wd": "https://ts2.mm.bing.net/th?id=OIP.zoRmWZcz99u4vvNdO2RDkwHaHa&pid=15.1&w=400&h=400&c=7",
    "ssd-160gb": "https://ts4.mm.bing.net/th?id=OIP.QN_szkdMd9eQNH_x5zzoEwHaGF&pid=15.1&w=400&h=400&c=7",
    "ssd-240-256gb": "https://ts2.mm.bing.net/th?id=OIP.Ng8B8bXR_2_6tM1eLWS0bwHaHa&pid=15.1&w=400&h=400&c=7",
    "ssd-240-256-samsung-wd": "https://ts3.mm.bing.net/th?id=OIP.wZTSyGS7Ln9cthUg-we_eAHaFF&pid=15.1&w=400&h=400&c=7",
    "ssd-480-512gb": "https://ts4.mm.bing.net/th?id=OIP.VjugXaE2NvxgymI4DQwC1wHaHa&pid=15.1&w=400&h=400&c=7",
    "m2-128gb": "https://ts2.mm.bing.net/th?id=OIP.gGWRhsAbLDtBkCzo_niJpQHaHa&pid=15.1&w=400&h=400&c=7",
    "m2-256gb": "https://ts4.mm.bing.net/th?id=OIP.N5DBHYwEX9yhkzgWy8nydAHaHa&pid=15.1&w=400&h=400&c=7",
    "m2-512gb": "https://ts1.mm.bing.net/th?id=OIP.tMYA7jlDycVfCuljaGG7GgAAAA&pid=15.1&w=400&h=400&c=7",
    "nvme-128gb": "https://ts1.mm.bing.net/th?id=OIP.VxYUNfwGxcgpunw7F8cHDwHaC4&pid=15.1&w=400&h=400&c=7",
    "nvme-256gb": "https://ts4.mm.bing.net/th?id=OIP.KmhQ57hSca__OY-Mx0kN7wHaHa&pid=15.1&w=400&h=400&c=7",
    "nvme-512gb": "https://ts2.mm.bing.net/th?id=OIP.TAvOpGRtM8O2ZIgISWxJggHaHa&pid=15.1&w=400&h=400&c=7",
    "lhdd-160gb": "https://ts3.mm.bing.net/th?id=OIP.77VHaEDXVyZSr8veE3kvPQHaHa&pid=15.1&w=400&h=400&c=7",
    "lhdd-250gb": "https://ts1.mm.bing.net/th?id=OIP.9V8s9Q9vR2osvnX-P9244QHaFk&pid=15.1&w=400&h=400&c=7",
    "lhdd-320gb": "https://ts2.mm.bing.net/th?id=OIP.No9b8huFNC4Mg8MDbRO8jQHaHa&pid=15.1&w=400&h=400&c=7",
    "lhdd-500gb": "https://ts1.mm.bing.net/th?id=OIP.lz_9C127BYSJH0Aivehq-gHaHa&pid=15.1&w=400&h=400&c=7",
    "lhdd-640gb": "https://ts4.mm.bing.net/th?id=OIP.T_TXFTv-ODhzemGF9OifVwHaHa&pid=15.1&w=400&h=400&c=7",
    "lhdd-750gb": "https://ts2.mm.bing.net/th?id=OIP.2UXF26nLEm-gIbgNTjZ__AHaHL&pid=15.1&w=400&h=400&c=7",
    "lhdd-1tb": "https://ts2.mm.bing.net/th?id=OIP.2PkA90w6v-NM_K0ZlaD-oQHaNk&pid=15.1&w=400&h=400&c=7",
    "lhdd-2tb": "https://ts4.mm.bing.net/th?id=OIP.uELuAT7WAXVDpi6D9woxnQHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-500gb": "https://ts4.mm.bing.net/th?id=OIP.sikd8Ed6EOLX4wq7R02PtQHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-500gb-wd": "https://ts4.mm.bing.net/th?id=OIP.bWiNMu_digUKhBTkxXBFywHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-640gb": "https://ts1.mm.bing.net/th?id=OIP.T2CLPAF6aHo15cm8vxkHyQHaKd&pid=15.1&w=400&h=400&c=7",
    "phdd-750gb": "https://ts4.mm.bing.net/th?id=OIP.zlRhE_hMDk1KYU2XWkh7ngHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-1tb": "https://ts4.mm.bing.net/th?id=OIP.t6NmyJSZ1GabjXLEctWRLgHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-1tb-wd": "https://ts1.mm.bing.net/th?id=OIP.o-ZK088FxiZ4ZA5mTLW3rQHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-15tb": "https://ts1.mm.bing.net/th?id=OIP.WntXfIcKY33sXGi0FH81BAHaJk&pid=15.1&w=400&h=400&c=7",
    "phdd-2tb": "https://ts3.mm.bing.net/th?id=OIP.gOArydV_uH4wVlTJYUBJEAHaJ-&pid=15.1&w=400&h=400&c=7",
    "phdd-3tb": "https://ts1.mm.bing.net/th?id=OIP.8X3IdjRZ6_BJEBOsZjbWBwHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-4tb": "https://ts4.mm.bing.net/th?id=OIP.kMkO-QK4RczbSWWQb96yXwHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-6tb": "https://ts3.mm.bing.net/th?id=OIP.EQ0OgbW1Dju7jxz2eAQKmAHaHa&pid=15.1&w=400&h=400&c=7",
    "phdd-8tb": "https://ts4.mm.bing.net/th?id=OIP.h2hFDO_3YOLDPQqhkY52QgHaL2&pid=15.1&w=400&h=400&c=7",
    "lram-2gb-ddr2": "https://ts3.mm.bing.net/th?id=OIP.pCDh2i7p_sVYTs5RPXJNqgHaVY&pid=15.1&w=400&h=400&c=7",
    "lram-2gb-ddr3": "https://ts4.mm.bing.net/th?id=OIP.zlspaesAjKRvzXdGnS1ZrQHaEK&pid=15.1&w=400&h=400&c=7",
    "lram-4gb-ddr3": "https://ts2.mm.bing.net/th?id=OIP.8yHRHE7Fsoaxdku7feb0KAHaE8&pid=15.1&w=400&h=400&c=7",
    "lram-8gb-ddr3": "https://ts1.mm.bing.net/th?id=OIP.BEs6xIjQD5OuMPP7DrDMgwHaHa&pid=15.1&w=400&h=400&c=7",
    "lram-4gb-ddr4": "https://ts3.mm.bing.net/th?id=OIP.dGsoALKNcrevhp7Nx-EMvAAAAA&pid=15.1&w=400&h=400&c=7",
    "lram-8gb-ddr4": "https://ts1.mm.bing.net/th?id=OIP.RJx_krG9c60mkkbITIzUCAHaHa&pid=15.1&w=400&h=400&c=7",
    "lram-16gb-ddr4": "https://ts1.mm.bing.net/th?id=OIP.NyBDLTgC8X_c8DpdhKvYkwHaHa&pid=15.1&w=400&h=400&c=7",
    "pram-2gb-ddr2": "https://ts2.mm.bing.net/th?id=OIP.MB6v7Ifilcd2nU5nwWtTbwHaHa&pid=15.1&w=400&h=400&c=7",
    "pram-2gb-ddr3": "https://ts2.mm.bing.net/th?id=OIP.eTuRGjPAOSbOnNB6DvwXPgAAAA&pid=15.1&w=400&h=400&c=7",
    "pram-4gb-ddr3": "https://ts4.mm.bing.net/th?id=OIP.GScgPSDLOHnr5ztdYH0IVQHaHa&pid=15.1&w=400&h=400&c=7",
    "pram-8gb-ddr3": "https://ts1.mm.bing.net/th?id=OIP.HxmHRgjyPz7DKDzPaDjomgHaKd&pid=15.1&w=400&h=400&c=7",
    "pram-4gb-ddr4": "https://ts2.mm.bing.net/th?id=OIP.BJdG9wLhYcE3YdC--kYr_wHaHa&pid=15.1&w=400&h=400&c=7",
    "pram-8gb-ddr4": "https://ts2.mm.bing.net/th?id=OIP.WMD6QZNsW9AvIfsWX7iGAgHaHa&pid=15.1&w=400&h=400&c=7",
    "pram-16gb-ddr4": "https://ts1.mm.bing.net/th?id=OIP.cvZXmRS9cfp2awhKPXWRoQHaGh&pid=15.1&w=400&h=400&c=7",
    "psu-p4-24pin": "https://ts4.mm.bing.net/th?id=OIP.OspcOY6D0CAuAm8QK7LFKQHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-24pin-6or8": "https://ts4.mm.bing.net/th?id=OIP.B7fCKFFRFUzVSQn0ENHCqQHaFm&pid=15.1&w=400&h=400&c=7",
    "psu-450-500w-2x6": "https://ts2.mm.bing.net/th?id=OIP.U48gIEVMBopLL6Za_37qGQHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-500-550w-6plus8": "https://ts1.mm.bing.net/th?id=OIP.fMyjZloz7yFQOhlY_yw88QHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-600w": "https://ts4.mm.bing.net/th?id=OIP.3_OCQ7ztfDFfz9atF4C1KgHaEz&pid=15.1&w=400&h=400&c=7",
    "psu-650w": "https://ts1.mm.bing.net/th?id=OIP.VnBNwrCHllLltXtGRo7JDAHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-700w": "https://ts3.mm.bing.net/th?id=OIP.X-_af6MGqBmkF1pBfBsd0AHaFj&pid=15.1&w=400&h=400&c=7",
    "psu-750w": "https://ts3.mm.bing.net/th?id=OIP.SYFuzeX7g38oZkt1kQtLlAHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-800w": "https://ts4.mm.bing.net/th?id=OIP.smqEKtOXe54lk7VDvbc7kwHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-850w": "https://ts2.mm.bing.net/th?id=OIP.M3LgNgBOZMvrfXCrrtTJjAHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-20-24pin-mini": "https://ts1.mm.bing.net/th?id=OIP.SVj6FiGDLW75PjAqHcbz_gHaHa&pid=15.1&w=400&h=400&c=7",
    "psu-branded": "https://ts3.mm.bing.net/th?id=OIP.wU5Ir0IEJ9QckJTK7A2-uwHaFd&pid=15.1&w=400&h=400&c=7",
    "fan-p4-478-amd-normal": "https://ts1.mm.bing.net/th?id=OIP.HETWD0wQTiFA2RV51lJXKgHaHa&pid=15.1&w=400&h=400&c=7",
    "fan-p4-478-copper": "https://ts4.mm.bing.net/th?id=OIP.o7n-Y1O5G1NXbDvxFAc9MQAAAA&pid=15.1&w=400&h=400&c=7",
    "fan-lga775-normal": "https://ts4.mm.bing.net/th?id=OIP.7TN99nf5Z_-8E2gNzO7OjAHaHl&pid=15.1&w=400&h=400&c=7",
    "fan-lga775-copper": "https://ts2.mm.bing.net/th?id=OIP.YNnCkk5spx5ayWtUYIi2nAHaHl&pid=15.1&w=400&h=400&c=7",
    "fan-lga1155-1150-normal": "https://ts3.mm.bing.net/th?id=OIP.piOYdGh5006cbBwMIUHnngHaHa&pid=15.1&w=400&h=400&c=7",
    "fan-lga1155-1150-copper": "https://ts2.mm.bing.net/th?id=OIP.ogL_Onf-XbWqLeeQ2jWFOgHaHa&pid=15.1&w=400&h=400&c=7",
    "fan-amd-am4": "https://ts3.mm.bing.net/th?id=OIP._-ljYNaf1iGokbadyBPeDgHaHl&pid=15.1&w=400&h=400&c=7",
    "cable-vga": "https://ts2.mm.bing.net/th?id=OIP.jjgVqQbUNSMkWUnv_yK_3gHaG2&pid=15.1&w=400&h=400&c=7",
    "cable-power": "https://ts4.mm.bing.net/th?id=OIP.5XGN06N1gvkNSeVcoLzvvAHaJQ&pid=15.1&w=400&h=400&c=7",
    "cable-sata-data": "https://ts2.mm.bing.net/th?id=OIP.f0jMrnhqVLLRSr_wv-LILgHaHa&pid=15.1&w=400&h=400&c=7",
    "cable-sata-lock": "https://ts1.mm.bing.net/th?id=OIP.nQ6fj71FUTGiyM7I_hycagHaHa&pid=15.1&w=400&h=400&c=7",
    "cable-sata-power": "https://ts4.mm.bing.net/th?id=OIP.akKxWYm1R1AEA_az6AXgaAHaHa&pid=15.1&w=400&h=400&c=7",
    "cable-sata-power-double": "https://ts1.mm.bing.net/th?id=OIP.SC8BgRLY9XNSd7CMZiUC_QHaHa&pid=15.1&w=400&h=400&c=7",
    "cable-ide": "https://ts3.mm.bing.net/th?id=OIP.Z5epmMhTTDjkhXGDwlkK6QHaHa&pid=15.1&w=400&h=400&c=7",
    "cable-2pin-power": "https://ts2.mm.bing.net/th?id=OIP.daBsHyopunWJhgdGnQ1vdAHaGe&pid=15.1&w=400&h=400&c=7",
    "lcd-power-adapter": "https://ts1.mm.bing.net/th?id=OIP.NGf04bu1zATALT4-Ql22lQHaHa&pid=15.1&w=400&h=400&c=7",
    "dvd-combo-ide": "https://ts3.mm.bing.net/th?id=OIP.zO9zJrrgPE3WoJBZ0jZhdwHaFj&pid=15.1&w=400&h=400&c=7",
    "dvd-writer-ide": "https://ts1.mm.bing.net/th?id=OIP.LLUlXqW84WJIgDAjEBg_NwHaFl&pid=15.1&w=400&h=400&c=7",
    "dvd-combo-sata": "https://ts4.mm.bing.net/th?id=OIP.89tOne9jBRHYEMLrePUqowHaFj&pid=15.1&w=400&h=400&c=7",
    "dvd-writer-sata": "https://ts3.mm.bing.net/th?id=OIP.yfUWK3yV-Qdk8btQLVCqSQHaFj&pid=15.1&w=400&h=400&c=7",
    "dvd-slim-writer-sata": "https://ts4.mm.bing.net/th?id=OIP.JNzUuXAE6RJhYPZAMvp4ggHaHa&pid=15.1&w=400&h=400&c=7",
    "pc-dvd-combo": "https://ts1.mm.bing.net/th?id=OIP.DlcS8D16vf8KuR-PbSx7iwHaGb&pid=15.1&w=400&h=400&c=7",
    "pc-dvd-writer": "https://ts1.mm.bing.net/th?id=OIP.DYkfYAisgoDExcxMePfokgHaHa&pid=15.1&w=400&h=400&c=7",
    "mouse-jedel-220": "https://ts3.mm.bing.net/th?id=OIP.dY0dFOhQe4qmVFUzoX-9nwHaHa&pid=15.1&w=400&h=400&c=7",
    "mouse-b300-dell-ms111": "https://ts2.mm.bing.net/th?id=OIP.SQV-Y7TCZXIfd1NY_kL8UAHaHa&pid=15.1&w=400&h=400&c=7",
    "mouse-office-op10": "https://ts1.mm.bing.net/th?id=OIP.PjgCluMVlD78TqZlvQvpNgHaHa&pid=15.1&w=400&h=400&c=7",
    "mouse-x500-hp": "https://ts4.mm.bing.net/th?id=OIP.pnms4lNr5eicADPP3xSn_gHaHa&pid=15.1&w=400&h=400&c=7",
    "mouse-game-x1": "https://ts3.mm.bing.net/th?id=OIP.VvMIaUM3qJGXZkD-g8kzZQHaHa&pid=15.1&w=400&h=400&c=7",
    "mouse-game-op40-g102": "https://ts1.mm.bing.net/th?id=OIP.BmieKZcydc1wWHsCUIcm_AHaGi&pid=15.1&w=400&h=400&c=7",
    "combo-gaming-gtx360": "https://ts3.mm.bing.net/th?id=OIP.WGcHQc43qKreHDYwlgjQmQHaHa&pid=15.1&w=400&h=400&c=7",
    "combo-wl-w500": "https://ts2.mm.bing.net/th?id=OIP.fGVgNSUFZj_yMznHpmcWXQHaHa&pid=15.1&w=400&h=400&c=7",
    "kb-ps2-hym-k1000-amy-kp8000": "https://ts3.mm.bing.net/th?id=OIP.yf5WwnIJjXvppCyTLrTYzgHaFQ&pid=15.1&w=400&h=400&c=7",
    "kb-ps2-bw08-jedel": "https://ts2.mm.bing.net/th?id=OIP.cx3h0eWQK26mjzS-_jPUMwHaKG&pid=15.1&w=400&h=400&c=7",
    "kb-usb-three-language": "https://ts2.mm.bing.net/th?id=OIP.RRvtukDrGqVlN2pPscSIagHaFX&pid=15.1&w=400&h=400&c=7",
    "kb-usb-mini-hp-dell": "https://ts4.mm.bing.net/th?id=OIP.9X2MMa2OPaFj_QdD-KydxAHaE1&pid=15.1&w=400&h=400&c=7",
    "kb-usb-flexible-small": "https://ts3.mm.bing.net/th?id=OIP.Mehf1fLkaQACU5ilxCQOzQHaHa&pid=15.1&w=400&h=400&c=7",
    "kb-usb-flexible-big": "https://ts4.mm.bing.net/th?id=OIP.5hm23PExNYLE648if1mSAgHaHa&pid=15.1&w=400&h=400&c=7",
    "kb-usb-gaming-banda-v3": "https://ts1.mm.bing.net/th?id=OIP.u9jtUvRyHdTCUix5FQJQnQHaE0&pid=15.1&w=400&h=400&c=7",
    "kb-usb-multimedia-banda-v5": "https://ts4.mm.bing.net/th?id=OIP.CvzIVFD3tpX6wT9KtN8g6QHaFY&pid=15.1&w=400&h=400&c=7",
    "kb-usb-gaming-banda-v2": "https://ts1.mm.bing.net/th?id=OIP.srdO9UBEQrxBM7vFPq1nJAHaHa&pid=15.1&w=400&h=400&c=7",
    "kb-wireless-multimedia-helios": "https://ts4.mm.bing.net/th?id=OIP.gYfzmZ9ZLZW63mxPU2wzzwHaHa&pid=15.1&w=400&h=400&c=7",
    "webcam-usb-m928-ms901": "https://ts1.mm.bing.net/th?id=OIP.YBeD30zgmqTW_41BKwzj8gHaHa&pid=15.1&w=400&h=400&c=7",
    "webcam-usb-720p-sound": "https://ts2.mm.bing.net/th?id=OIP.jKhoy4AwJrePbvZgbZ0UrQHaHa&pid=15.1&w=400&h=400&c=7",
    "webcam-usb-1080p": "https://ts4.mm.bing.net/th?id=OIP.PB8NSy_2H4dDqb5FssFYVQHaHm&pid=15.1&w=400&h=400&c=7",
    "mic-usb-tucci-mk100": "https://ts1.mm.bing.net/th?id=OIP.juZgLG9ns2zBT3ePn8AupgHaIl&pid=15.1&w=400&h=400&c=7",
    "sc-51-usb": "https://ts4.mm.bing.net/th?id=OIP.UgpoSOoi_1J_-LN2hEkhRAHaGg&pid=15.1&w=400&h=400&c=7",
    "sc-71-usb": "https://ts3.mm.bing.net/th?id=OIP.2rZlYcLo8Hje-Z1Murrt0QHaHa&pid=15.1&w=400&h=400&c=7",
    "sc-71-usb-hifi": "https://ts3.mm.bing.net/th?id=OIP.LeGgTmx4xpN_ZliqSXBvlwHaHa&pid=15.1&w=400&h=400&c=7",
    "sc-71x2-usb": "https://ts3.mm.bing.net/th?id=OIP.hLn8gjhKOfwYst2ymIgchQHaHa&pid=15.1&w=400&h=400&c=7",
    "sc-pci": "https://ts3.mm.bing.net/th?id=OIP.8AeeqaKBV5mtvWD2od3_9gHaFK&pid=15.1&w=400&h=400&c=7",
    "sc-pcie-51": "https://ts4.mm.bing.net/th?id=OIP.isOPTK3ZPMnvOMRgnnKsJwHaHH&pid=15.1&w=400&h=400&c=7",
    "bn-comp-cpus": "https://ts4.mm.bing.net/th?id=OIP.q4bcGTMWA2uq_Nr4K6pyOgHaEK&pid=15.1&w=400&h=400&c=7",
    "bn-comp-gpus": "https://ts4.mm.bing.net/th?id=OIP.IDKc-M4IVNb2YTnrFS709AHaD4&pid=15.1&w=400&h=400&c=7",
    "bn-comp-mobos": "https://ts3.mm.bing.net/th?id=OIP.HpL---16wRfyuRKDfw1U0wHaFD&pid=15.1&w=400&h=400&c=7",
    "bn-comp-ram": "https://ts2.mm.bing.net/th?id=OIP.o3M-Mpk27DzJd57sueJDTgHaJp&pid=15.1&w=400&h=400&c=7",
    "bn-comp-nvme": "https://ts1.mm.bing.net/th?id=OIP.rppjDHwOkf17t_cuu6IWHAHaF7&pid=15.1&w=400&h=400&c=7",
    "bn-comp-psucase": "https://ts1.mm.bing.net/th?id=OIP.uhAEpqGpkT32DkEbhf37kwHaIQ&pid=15.1&w=400&h=400&c=7"
};

  window.getAquaCategoryIcon = function (sectionId) {
    return CAT_ICONS[sectionId] || "assets/cats/expansion.webp";
  };

  window.getAquaPartFallback = function (item, sectionId, subcatName) {
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

  window.getAquaPartImage = function (item, sectionId, subcatName) {
    if (item && typeof item.image === "string" && item.image.trim()) {
      return item.image.trim();
    }
    if (item && item.id && Object.prototype.hasOwnProperty.call(ITEM_IMAGES, item.id)) {
      return ITEM_IMAGES[item.id];
    }
    return window.getAquaPartFallback(item, sectionId, subcatName);
  };
})();
