<template>
  <div>
    <pre>{{ books }}</pre>
    <b-input v-model="search" />
    <pre>{{ filteredBooks }}</pre>
    <b-input v-model="bookInput.title" />
    <b-input v-model="bookInput.author" />

    <b-btn @click="addBook(bookInput.title, bookInput.author)">Add Book</b-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import {
  addBook,
  books,
  filteredBooks,
  IBook,
  search
} from "@/components/compositions/store";

export default defineComponent({
  setup() {
    const bookInput = reactive<IBook>({ title: "", author: "" });

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
