<script lang="ts">
  import type { RlCtrnn } from "ctrnn.js";

  import { Vega } from "svelte-vega";
  import spec from "../spec/matrix";

  export let ctrnn: RlCtrnn;
  $: data = getData(ctrnn);

  function getData(ctrnn: RlCtrnn): { nodes: any[], edges: any[] } {
    const nodes = ctrnn.biases.map((bias, index) => {
      return { name: index, bias, group: 0, index: index };
    });

    const edges = [];
    for (let i = 0; i < ctrnn.size; i++) {
      for (let j = 0; j < ctrnn.size; j++) {
      let value = ctrnn.weights[i][j]
        edges.push({
          source: i,
          target: j,
          value,
          opacity: Math.pow(Math.abs(value), 4) * 1.0
        });
      }
    }

    return { nodes, edges };
  }
</script>

<Vega {data} {spec} view={undefined} />
