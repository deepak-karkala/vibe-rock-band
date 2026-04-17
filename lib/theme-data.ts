export type BandMember = {
  character: "Zara" | "Miles" | "Rex" | "Luna" | "Kai";
  role: string;
  tagline: string;
  accent: string;
};

export type BandTheme = {
  id: string;
  name: string;
  mood: string;
  summary: string;
  stageLabel: string;
  defaultDirection: string;
  suggestedDirections: string[];
  presetButtons: string[];
  members: BandMember[];
};

export const bandThemes: BandTheme[] = [
  {
    id: "midnight-cathedral",
    name: "Midnight Cathedral",
    mood: "Gothic weight, slow thunder, brass light.",
    summary: "The band plays like the room itself is reverberating back.",
    stageLabel: "Cathedral haze",
    defaultDirection: "Make it heavier, slower, and cathedral-dark.",
    suggestedDirections: [
      "Make it heavier, slower, and cathedral-dark.",
      "Give me a huge chorus with distant bells and low drums.",
      "Strip it back, then bring the guitars back like thunder.",
    ],
    presetButtons: ["Pink Floyd", "Heavy Metal", "Jazz Fusion"],
    members: [
      { character: "Zara", role: "Guitar", tagline: "Cuts the rafters open.", accent: "#a23621" },
      { character: "Miles", role: "Keys", tagline: "Turns smoke into harmony.", accent: "#cbb89d" },
      { character: "Rex", role: "Drums", tagline: "Keeps the floor breathing.", accent: "#6e7c86" },
      { character: "Luna", role: "Bass", tagline: "Pulls everything underground.", accent: "#2f5d50" },
      { character: "Kai", role: "Vox", tagline: "Hypes the room without mercy.", accent: "#c27a2c" },
    ],
  },
  {
    id: "desert-riot",
    name: "Desert Riot",
    mood: "Dust, heat, stripped-back rhythm, feral swagger.",
    summary: "A dry stage with too much attitude and nowhere to hide.",
    stageLabel: "Heat shimmer",
    defaultDirection: "Keep it dry, dirty, and relentless.",
    suggestedDirections: [
      "Keep it dry, dirty, and relentless.",
      "Push the drums forward and make the guitars feel sunburnt.",
      "Turn it into a midnight road anthem with a mean bassline.",
    ],
    presetButtons: ["Heavy Metal", "Taylor Swift", "Pink Floyd"],
    members: [
      { character: "Zara", role: "Guitar", tagline: "Runs amps hotter than the weather.", accent: "#a23621" },
      { character: "Miles", role: "Keys", tagline: "Adds mirage and menace.", accent: "#cbb89d" },
      { character: "Rex", role: "Drums", tagline: "Prefers grooves that kick up dust.", accent: "#6e7c86" },
      { character: "Luna", role: "Bass", tagline: "Keeps the road under the song.", accent: "#2f5d50" },
      { character: "Kai", role: "Vox", tagline: "Sells every line like a dare.", accent: "#c27a2c" },
    ],
  },
  {
    id: "velvet-revolt",
    name: "Velvet Revolt",
    mood: "Sleek drama, late-night confidence, controlled burn.",
    summary: "A band that sounds expensive until it decides not to behave.",
    stageLabel: "Velvet glow",
    defaultDirection: "Make it sleek, dramatic, and a little dangerous.",
    suggestedDirections: [
      "Make it sleek, dramatic, and a little dangerous.",
      "Give me a restrained verse that erupts into a glowing hook.",
      "Push the bass and make the whole thing feel expensive and doomed.",
    ],
    presetButtons: ["Taylor Swift", "Pink Floyd", "Jazz Fusion"],
    members: [
      { character: "Zara", role: "Guitar", tagline: "Prefers sharp exits and sharper riffs.", accent: "#a23621" },
      { character: "Miles", role: "Keys", tagline: "Loves a polished collapse.", accent: "#cbb89d" },
      { character: "Rex", role: "Drums", tagline: "Grooves with surgical cruelty.", accent: "#6e7c86" },
      { character: "Luna", role: "Bass", tagline: "Turns elegance into pressure.", accent: "#2f5d50" },
      { character: "Kai", role: "Vox", tagline: "Can make menace sound flirtatious.", accent: "#c27a2c" },
    ],
  },
  {
    id: "neon-funeral",
    name: "Neon Funeral",
    mood: "Cold lights, wounded synths, ceremonial pulse.",
    summary: "Still inside the analog world, just colder and more spectral.",
    stageLabel: "Cold afterglow",
    defaultDirection: "Make it colder, more spectral, and full of tension.",
    suggestedDirections: [
      "Make it colder, more spectral, and full of tension.",
      "Give me a funeral march hidden inside a synth anthem.",
      "Let the drums pulse while the rest of the band haunts the room.",
    ],
    presetButtons: ["Pink Floyd", "Jazz Fusion", "Heavy Metal"],
    members: [
      { character: "Zara", role: "Guitar", tagline: "Turns feedback into weather.", accent: "#a23621" },
      { character: "Miles", role: "Keys", tagline: "Lives for the beautiful wrong note.", accent: "#cbb89d" },
      { character: "Rex", role: "Drums", tagline: "Keeps the pulse ceremonial.", accent: "#6e7c86" },
      { character: "Luna", role: "Bass", tagline: "Makes the floor feel colder.", accent: "#2f5d50" },
      { character: "Kai", role: "Vox", tagline: "Can turn a whisper into a procession.", accent: "#c27a2c" },
    ],
  },
  {
    id: "after-hours-empire",
    name: "After Hours Empire",
    mood: "Big room confidence, brass edges, night-drive momentum.",
    summary: "A stadium version of a 2 a.m. city with too many lights still on.",
    stageLabel: "City burn",
    defaultDirection: "Make it huge, nocturnal, and made for a city skyline.",
    suggestedDirections: [
      "Make it huge, nocturnal, and made for a city skyline.",
      "Start restrained, then open it into a full-lights chorus.",
      "Give me a bass-driven pulse with brass-lit guitars over the top.",
    ],
    presetButtons: ["Taylor Swift", "Heavy Metal", "Pink Floyd"],
    members: [
      { character: "Zara", role: "Guitar", tagline: "Wants every chorus to feel structural.", accent: "#a23621" },
      { character: "Miles", role: "Keys", tagline: "Builds skylines out of chords.", accent: "#cbb89d" },
      { character: "Rex", role: "Drums", tagline: "Treats grooves like machinery.", accent: "#6e7c86" },
      { character: "Luna", role: "Bass", tagline: "Keeps the whole city under tension.", accent: "#2f5d50" },
      { character: "Kai", role: "Vox", tagline: "Believes everything sounds better louder.", accent: "#c27a2c" },
    ],
  },
];

export function getThemeById(themeId: string) {
  return bandThemes.find((theme) => theme.id === themeId) ?? bandThemes[0];
}
