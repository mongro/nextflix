import { Suspense } from "react";

const testPromise = (i: number, delay?: number) =>
  new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(i);
    }, i * 1000);
  });

interface Props {
  delay?: number;
  i: number;
}

const Section = async ({ i }: Props) => {
  const result = await testPromise(i);
  return <div>{result}</div>;
};

export default async function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {" "}
        <Section i={1} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Section i={2} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Section i={3} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Section i={4} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Section i={5} />
      </Suspense>
      <Section i={6} />

      <h1>Test</h1>
    </div>
  );
}
