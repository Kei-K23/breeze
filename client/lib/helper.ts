export function randomColor() {
  const colors = [
    "text-orange-400",
    "text-amber-400",
    "text-yellow-400",
    "text-lime-400",
    "text-green-400",
    "text-cyan-400",
    "text-indigo-400",
    "text-purple-400",
    "text-rose-400",
  ];

  const random = colors[Math.floor(Math.random() * colors.length)];

  return random;
}
