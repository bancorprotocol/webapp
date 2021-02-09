import { reactive, computed, ref } from "@vue/composition-api";

export interface IBook {
  title: string;
  author: string;
}

export const search = ref<string>("");
export const books = reactive<IBook[]>([]);

export const filteredBooks = computed(() =>
  books.filter(book => book.title.includes(search.value))
);

export const addBook = (title: string, author: string) =>
  books.push({ title, author });
