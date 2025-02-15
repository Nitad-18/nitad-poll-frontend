<script lang="ts">
  import pollStore from '../stores/PollStore'
  import type { PollDetail } from '$lib/types'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import axiosInstance from '../axios'

  let question = ''
  let options: [string][] = [['']]

  // the qustion <input />
  let questionInput: HTMLInputElement

  /**
   * validate the form before submitting
   */
  const validateForm = () => {
    // check if question is empty
    if (question.trim() === '') {
      return false
    }
    // check if at least one option is entered
    for (const [option] of options) {
      if (option.trim() !== '') {
        return true
      }
    }
    return false
  }

  /**
   * remove duplicate options
   */
  const removeDuplicate = () => {
    const seenOptions = new Set<string>()
    options = options.filter(([option]) => {
      if (seenOptions.has(option)) {
        return false
      }
      seenOptions.add(option)
      return true
    })
  }

  /**
   * create a new deault poll
   */
  const createPoll = async (): Promise<PollDetail> => {
    return await axiosInstance.createPoll(question, options)
  }

  const handleSubmit = async () => {
    // validate the form
    if (!validateForm()) return
    // remove duplicate options
    removeDuplicate()
    // create a new poll from the validated form data
    const poll = await createPoll()
    // save the poll to poll store
    pollStore.add(poll)
    // navigate to the current polls page
    goto('/')
  }

  /**
   * add a new option to the form
   */
  const addOption = () => {
    options = [[''], ...options]
  }

  /**
   * autofocus on the new option input
   */
  const autofocus = (e: CustomEvent, index: number) => {
    if (index === 0 && options.length > 1) {
      ;(e.target as HTMLInputElement).focus()
    }
  }

  onMount(() => {
    questionInput.focus()
  })
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="card p-5 text-center w-[32rem] mx-auto"
>
  <h1>Question:</h1>
  <input
    type="text"
    bind:this={questionInput}
    bind:value={question}
    placeholder="Your question"
    required
  />
  <h1>Options:</h1>
  {#each options as option, index (option)}
    <input
      type="text"
      animate:flip={{ duration: 300 }}
      in:fly={{ duration: 500, y: 10 }}
      on:introstart={(e) => autofocus(e, index)}
      bind:value={option[0]}
      placeholder="Option {options.length - index}"
      on:keypress={(e) => {
        if (e.key === 'Enter') {
          addOption()
        }
      }}
    />
  {/each}

  <button
    type="button"
    class="text-gray-200 mb-3 underline text-sm"
    on:click={addOption}>Add Option</button
  >
  <br />
  <button on:click={handleSubmit} type="button" class="btn-primary"
    >Submit</button
  >
</form>
