<script>
  import {loading} from './pages/_store';
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  
  loading.set(true);
  
</script>

<style  global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<Router {routes} />