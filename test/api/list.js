// api/list.js
// Endpoint untuk melihat daftar file yang tersedia (butuh token)

const VALID_TOKENS = process.env.VALID_TOKENS
  ? process.env.VALID_TOKENS.split(",")
  : ["5PloBkNbTn4zV8YLjsVJVNweS1J2LbwU"];

// Daftar file hardcoded (update sesuai kebutuhan, atau bisa auto-fetch dari index)
const FILE_LIST = [
  "gunung_limasatu.json",
  "king_obstacle.json",
  "laufas_obstacle.json",
  "mount_adelza.json",
  "mount_aetheria.json",
  "mount_aetheria_normal.json",
  "mount_aetheria_vip.json",
  "mount_agee.json",
  "mount_agora.json",
  "mount_alstar_v2.json",
  "mount_asetas.json",
  "mount_atviel_v2.json",
  "mount_ayriene.json",
  "mount_bali.json",
  "mount_bejirlah.json",
  "mount_cane.json",
  "mount_coco.json",
  "mount_doragon.json",
  "mount_ekuinoks.json",
  "mount_elystra.json",
  "mount_eunola.json",
  "mount_frestel.json",
  "mount_funny.json",
  "mount_geuru.json",
  "mount_goya.json",
  "mount_greenveil.json",
  "mount_histeria.json",
  "mount_hyze.json",
  "mount_island.json",
  "mount_kita.json",
  "mount_koja.json",
  "mount_koplo.json",
  "mount_kumaha_v2.json",
  "mount_laniakea.json",
  "mount_lora.json",
  "mount_lotis_beta.json",
  "mount_maltehera_v2.json",
  "mount_mantab.json",
  "mount_moonlight_v2.json",
  "mount_morohmoy.json",
  "mount_mukjizat.json",
  "mount_mukjizat_v2.json",
  "mount_ngebut.json",
  "mount_noxera.json",
  "mount_qiran.json",
  "mount_rakyat.json",
  "mount_rise.json",
  "mount_runia_v2.json",
  "mount_ruta.json",
  "mount_sawit.json",
  "mount_sonata.json",
  "mount_sonrun.json",
  "mount_space.json",
  "mount_timen.json",
  "mount_velora.json",
  "mount_velvet.json",
  "mount_vespheria.json",
  "mount_vespheria_habeg.json",
  "mount_vespheria_kanan.json",
  "mount_vespheria_tengah.json",
  "mount_vici.json",
  "mount_victoria.json",
  "mount_victoria_v2.json",
  "mount_viox.json",
  "mount_xaria.json",
  "mount_yagesya.json",
  "mount_yahayuk.json",
  "mount_yahayuk_normal.json",
  "mount_yahayuk_v2.json",
  "mount_yahayuk_vip.json",
  "mount_yajato.json",
  "mount_yakuja_v2.json",
  "mount_yayakin_gold.json",
  "mount_yayakin_normal.json",
  "mount_yayakin_pink.json",
  "mount_yayakin_pink_vip.json",
  "mount_yayakin_vip.json",
  "mount_yntks.json",
];

export default function handler(req, res) {
  const token = req.query.token;

  if (!token || !VALID_TOKENS.includes(token)) {
    return res.status(403).json({ error: "Access denied", message: "Token tidak valid." });
  }

  const host = req.headers.host;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const files = FILE_LIST.map((name) => ({
    name,
    download_url: `${baseUrl}/api/json/${name}?token=${token}`,
  }));

  return res.status(200).json({
    total: files.length,
    files,
  });
}
