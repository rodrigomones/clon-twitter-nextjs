import { firestore } from "../../firebase/admin";
import Devit from "../../components/Devit";
import { useRouter } from "next/router";

export default function DevitPage(props) {
  const router = useRouter();

  if (router.isFallback) return <h1>Cargando...</h1>;
  return (
    <>
      <Devit {...props} />
      <style jsx>{``}</style>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "Fg9DSP9h3FYUBhp082bL" } }],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;

  return firestore
    .collection("devits")
    .doc(id)
    .get()
    .then((doc) => {
      const data = doc.data();
      const id = doc.id;
      const { createdAt } = data;

      const props = {
        ...data,
        id,
        createdAt: +createdAt.toDate(),
      };
      return { props };
    })
    .catch(() => {
      return { props: {} };
    });
}
