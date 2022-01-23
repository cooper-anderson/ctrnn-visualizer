<script lang="ts">
  import { onDestroy } from "svelte";
  import Matrix from "../vega/Matrix.svelte";

  import { RlCtrnn } from "ctrnn.js";

  let ctrnn = new RlCtrnn(10);
  let opts: number[][] = [];

  for (let i = 0; i < ctrnn.size; i++) {
    opts[i] = [];
    for (let j = 0; j < ctrnn.size; j++) {
      opts[i][j] = Math.random() * 2 * Math.PI;
    }
  }

  let interval = setInterval(() => {
    for (let i = 0; i < ctrnn.size; i++) {
      for (let j = 0; j < ctrnn.size; j++) {
        let w = Math.sin(Date.now() / (1000 - 100 * opts[i][j]));
        ctrnn.setWeight(i, j, w);
      }
    }
    ctrnn = ctrnn;
  }, 1000/60);

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<Matrix ctrnn={ctrnn} />
