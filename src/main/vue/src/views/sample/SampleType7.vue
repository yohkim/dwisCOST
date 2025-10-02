<template>
	<div>   
    <ul class="error_mapping">
        <li>
            <a href="#" class="up_r_left"></a>
            <a href="#" class="up_left"></a>
            <a href="#" class="up_m_left on"></a>
            <a href="#" class="up_right"></a>
            <a href="#" class="up_r_right"></a>
        </li>
        <li>
            <a href="#" class="left_up"></a>
            <a href="#" class="blank1"></a>
            <a href="#" class="right_up"></a>
        </li>   
        <li>
            <a href="#" class="left_mdl"></a>
            <a href="#" class="blank2"></a>
            <a href="#" class="right_mdl"></a>
        </li>   
        <li>
            <a href="#" class="left_dw"></a>
            <a href="#" class="blank3"></a>
            <a href="#" class="right_dw"></a>
        </li>   
        <li>
            <a href="#" class="dw_r_left"></a>
            <a href="#" class="dw_left"></a>
            <a href="#" class="dw_m_left"></a>
            <a href="#" class="dw_right"></a>
            <a href="#" class="dw_r_right"></a>
        </li>

    </ul>
  </div>	
</template>
<script>
export default {
    
}
</script>
<style lang="scss">
.error_mapping{
    width:410px;
    height:552px;
    margin: 0;
    padding: 0;
 li{
    display:flex;
    a{
        &.up_r_left{
            background:url('@assets/images/error_check/error_checked_off_01.png');
            width:99px;
            height:88px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_01.png')
            }
        }
        &.up_left{
            background:url('@assets/images/error_check/error_checked_off_02.png');
            width:55px;
            height:88px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_02.png')
            }
        }
        &.up_m_left{
            background:url('@assets/images/error_check/error_checked_off_03.png');
            width:100px;
            height:88px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_03.png')
            }
        }
        &.up_right{
            background:url('@assets/images/error_check/error_checked_off_04.png');
            width:55px;
            height:88px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_04.png')
            }
        }
        &.up_r_right{
            background:url('@assets/images/error_check/error_checked_off_05.png');
            width:101px;
            height:88px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_05.png')
            }
        }
        &.left_up{
            background:url('@assets/images/error_check/error_checked_off_06.png');
            width:99px;
            height:110px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_06.png')
            }
        }
        &.blank1{
            background:url('@assets/images/error_check/error_checked_on_07.png');
            width:210px;
            height:110px;
        }
        &.right_up{
            background:url('@assets/images/error_check/error_checked_off_08.png');
            width:101px;
            height:110px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_08.png')
            }
        }   
        &.left_mdl{
            background:url('@assets/images/error_check/error_checked_off_09.png');
            width:99px;
            height:160px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_09.png')
            }
        }
        &.blank2{
            background:url('@assets/images/error_check/error_checked_on_10.png');
            width:210px;
            height:160px;
        }
        &.right_mdl{
            background:url('@assets/images/error_check/error_checked_off_11.png');
            width:101px;
            height:160px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_11.png')
            }
        }         
        &.left_dw{
            background:url('@assets/images/error_check/error_checked_off_12.png');
            width:99px;
            height:110px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_12.png')
            }
        }
        &.blank3{
            background:url('@assets/images/error_check/error_checked_on_13.png');
            width:210px;
            height:110px;
        }
        &.right_dw{
            background:url('@assets/images/error_check/error_checked_off_14.png');
            width:101px;
            height:110px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_14.png')
            }
        }         
        &.dw_r_left{
            background:url('@assets/images/error_check/error_checked_off_15.png');
            width:99px;
            height:84px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_15.png')
            }
        }
        &.dw_left{
            background:url('@assets/images/error_check/error_checked_off_16.png');
            width:55px;
            height:84px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_16.png')
            }
        }
        &.dw_m_left{
            background:url('@assets/images/error_check/error_checked_off_17.png');
            width:100px;
            height:84px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_17.png')
            }
        }
        &.dw_right{
            background:url('@assets/images/error_check/error_checked_off_18.png');
            width:55px;
            height:84px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_18.png')
            }
        }
        &.dw_r_right{
            background:url('@assets/images/error_check/error_checked_off_19.png');
            width:101px;
            height:84px;
            &:hover, &.on{
            background:url('@assets/images/error_check/error_checked_on_19.png')
            }
        }        
        
        }
 }
}
</style>