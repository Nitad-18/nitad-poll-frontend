<script lang="ts">
  import user from '../stores/userStore'
  import type { PagePathDetail } from './types'
  import axiosInstance from '../axios'

  // path is recieved from the script above
  export let currentPath: string
  export let paths: PagePathDetail[]

  const handleButtonClick = async () => {
    if ($user && (await axiosInstance.logout())) {
      user.set(null)
    }
  }
</script>

<nav class="flex justify-center space-x-7 my-8 items-center">
  <h1 class="hidden">navigation bar</h1>
  {#each paths as path}
    <a
      href={path.path}
      class:hover:text-gray-300={path.path !== currentPath}
      class:!text-blue-300={path.path === currentPath}>{path.name}</a
    >
  {/each}
  {#if $user}
    <button on:click={handleButtonClick} class="btn-primary">logout</button>
  {/if}
</nav>

<style>
  a {
    @apply text-xl font-semibold text-gray-100
        transition-colors no-underline;
  }
</style>
