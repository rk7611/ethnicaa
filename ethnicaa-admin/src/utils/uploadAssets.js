import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export async function uploadFiles(slug, files = []) {
  const urls = [];
  for (const file of files) {
    const fileRef = ref(storage, `products/${slug}/${file.name}`);
    await uploadBytes(fileRef, file);
    urls.push(await getDownloadURL(fileRef));
  }
  return urls;
}

export async function uploadSingle(slug, file, nameOverride) {
  if (!file) return "";
  const fileRef = ref(storage, `products/${slug}/${nameOverride || file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
