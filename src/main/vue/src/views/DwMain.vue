<template>
	<div>
    <div class="main">
      <MenuTabs></MenuTabs>
      <div class="footer">          
        <div>ⓒ 2024 DOWOOINSYS</div>
        <div class="logo"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: "DwMain",
}
</script>
<style scoped>
::-webkit-scrollbar {
  width: 8px;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background-color: #384462;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb { 
  background-color: skyblue;
  border-radius: 8px;
}
::-webkit-scrollbar-button {
  display: none;
}
</style>