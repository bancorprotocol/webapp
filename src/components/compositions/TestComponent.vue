<template>
  <div>
    <pre>{{ books }}</pre>
    <b-input v-model="search" />
    {{ search }}
    <pre>{{ filteredBooks }}</pre>
    <b-input v-model="bookInput.title" />
    <b-input v-model="bookInput.author" />

    <b-btn @click="addBook(bookInput.title, bookInput.author)">Add Book</b-btn>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "@vue/composition-api";
import { addBook, books, IBook } from "@/components/compositions/store";

export default defineComponent({
  setup() {
    const bookInput = reactive<IBook>({ title: "", author: "" });

    const search = ref<string>("");

    const filteredBooks = computed(() => {
      return books.filter(book => {
        return book.title === "ja";
      });
    });

    return {
      books,
      addBook,
      filteredBooks,
      search,
      bookInput
    };
  }
});
</script>
