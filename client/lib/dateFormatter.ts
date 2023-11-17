const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

export function dateFormatter(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).format(date);
}

export function getCurrentYear() {
  return new Intl.DateTimeFormat("en-Us", {
    year: "numeric",
  }).format(new Date());
}
