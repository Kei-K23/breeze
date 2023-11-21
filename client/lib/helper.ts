import { UserType } from "@/app/(dashboard)/_components/RightSideBar";

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

export function getUniqueData({
  arr1,
  arr2,
  specificFile,
}: {
  arr1: UserType[];
  arr2: UserType[];
  specificFile?: string;
}): UserType[] {
  const reduceArr1 = arr1.reduce((acc: Array<string>, curr) => {
    const id = curr._id;
    acc.push(id);
    return acc;
  }, []);

  const reduceArr2 = arr2.reduce((acc: Array<string>, curr) => {
    const id = curr._id;
    acc.push(id);
    return acc;
  }, []);

  // Get unique elements from arr1 that are not in arr2
  const uniqueFromArr1 = reduceArr1.filter((item) => {
    return !reduceArr2.includes(item);
  });

  // Get unique elements from arr2 that are not in arr1
  const uniqueFromArr2 = reduceArr2.filter(
    (item) => !reduceArr1.includes(item)
  );
  console.log(reduceArr1, reduceArr2);

  // Combine unique elements from both arrays
  return uniqueFromArr1.concat(uniqueFromArr2) as unknown as UserType[];
}
