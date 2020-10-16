<?php
    /*
    Plugin Name: CTL Arcade - Slot Mr Chicken
    Plugin URI: http://www.codethislab.com/
    Description: Slot Mr Chicken for CTL Arcade Wordpress Plugin.
    Version: 1.0
    Author: Code This Lab srl
    Author URI: http://www.codethislab.com/
    License: GPL
    Copyright: Code This Lab srl
    */


    class CTLArcadeSlotMrChicken {

        // variabili membro
        private $_szCompatibleArcadeVersion = "1";
        private $_szPluginDir               = "ctl-slot-mr-chicken";
        private $_szPluginName              = "Slot Mr Chicken";
        private $_szAspectRatio             = "7:3";
        private $_bGameRankAvailable        = 1; // 1 yes, 0 no
        private $_szGameTags                = "bonus, bonus game, casino, chicken, gambling, html5, instant win, mobile, money, poker, slot, slot machine, videopoker, win";


        // funzioni
        public function __construct() {

            register_activation_hook( __FILE__,
                array( $this, 'onInstallDbData' ) );
            add_action( 'admin_menu',
                array( $this, 'onMenu' ) );
            register_activation_hook( __FILE__,
                array($this,'onSetActivationRedirect') );
            add_action( 'admin_init',
                array( $this, 'onActivationRedirect') );

        }

        private function __checkArcadePluginVersion(){
            $installed_ver = get_option( "CTL_ARCADE_PLUGIN_VERSION" );
            if(!$installed_ver){
                return false;
            }

            $aVersions = explode(" ", $installed_ver);

            if( intval($aVersions[0]) != intval($this->_szCompatibleArcadeVersion) ){
                return false;
            }

            return true;
        }

        private function __checkDbData(){
            global $wpdb;
            $oRow = $wpdb->get_row( "SELECT * FROM " . $wpdb->prefix . "ctl_arcade_games WHERE game_plugin_dir = '". $this->_szPluginDir."'");

            if( !$oRow ){
                return false;
            }
            return true;
        }

        private function __copyFiles( $szFileName ){

            $upload_dir = wp_upload_dir();
            $_szFileName = $szFileName;

            if ( !$this->__checkRecursiveFileExists($szFileName, $upload_dir["basedir"]) ){
                // $filename should be the path to a file in the upload directory.
                $szPath = plugins_url() .
                    "/" . $this->_szPluginDir .
                    "/images/". $_szFileName;

                media_sideload_image($szPath,0);
            }
        }

        private function __checkRecursiveFileExists($filename, $directory){
            try {
                // loop through the files in directory
                foreach(new recursiveIteratorIterator( new recursiveDirectoryIterator($directory)) as $file) {
                    // if the file is found
                    if( $filename == basename($file) ) {
                        return true;

                    }
                }
                // if the file is not found
                return false;
            } catch(Exception $e) {
                // if the directory does not exist or the directory
                // or a sub directory does not have sufficent
                //permissions return false
                return false;
            }
        }

        public function onMenu() {

            if( !(is_plugin_active("ctl-arcade/ctl-arcade.php") &&
                $this->__checkArcadePluginVersion() &&
                $this->__checkDbData()) ){


                if ( empty ( $GLOBALS['admin_page_hooks']['ctl_arcade_games'] ) ){
                    add_menu_page(
                        'CTL Games',
                        'CTL Games',
                        'manage_options',
                        'ctl_arcade_games',
                        array( $this, 'onShowDollyPage'),
                        "none"
                    );
                    add_submenu_page( 'ctl_arcade_games', "Games List", "Games List", 'manage_options',
                        'ctl_arcade_games', array( $this,"onShowDollyPage") );
                }

                add_submenu_page( 'ctl_arcade_games',
                    $this->_szPluginName,
                    "Install " . $this->_szPluginName, 'manage_options',
                    'ctl_arcade_game_'.$this->_szPluginDir,
                    array($this, "onShowSettings") );
            }else{
                add_filter( 'plugin_action_links_' . plugin_basename(__FILE__),
                    array($this,'onAddActionLinks') );
            }
        }

        public function onShowDollyPage(){
            ?>
            <div class="ctl-arcade-wrapper">
                <h1>Full Compatible Arcade Games</h1>

                <p>Check if new games are available: <a target="_blank" href="http://codecanyon.net/collections/5401443-ctl-arcade-plugin/?ref=codethislab">http://codecanyon.net/collections/5401443-ctl-arcade-plugin</a>.</p>

                <h1>Manage Games</h1>
                <?php
                    if( is_plugin_active("ctl-arcade/ctl-arcade.php") ){
                        ?>
                        <p>Open CTL Arcade Plugin to manage <a href="<?php echo admin_url(); ?>admin.php?page=ctl_arcade_page_manage_games">installed games</a> or check the <a href="<?php echo admin_url()."plugins.php"; ?>">plugin page</a> if there are some games to enable.</p>
                    <?php
                    }else{
                        ?>
                        <p>In order to manage games, you have to install and enable the <strong>CTL Arcade Plugin</strong>
                            first.</p>
                        <p>You can buy it from this url: <a target="_blank" href="http://codecanyon.net/user/codethislab/portfolio/?ref=codethislab">http://codecanyon.net/user/codethislab/portfolio</a></p>
                    <?php
                    }
                ?>
            </div>
        <?php
        }

        public function onInstallDbData(){
            global $wpdb;



            if(!$this->__checkArcadePluginVersion() ||
                $this->__checkDbData() ){
                return false;
            }

            $oResult = $wpdb->insert(
                $wpdb->prefix ."ctl_arcade_games",
                array(
                    'time'              => current_time( 'mysql' ),
                    'game_plugin_dir'   => $this->_szPluginDir,
                    'game_name'         => $this->_szPluginName,
                    'game_aspect_ratio' => $this->_szAspectRatio,
                    'game_rank'         => $this->_bGameRankAvailable,
                    'game_tags'         => $this->_szGameTags,
                    'game_settings'     => ""
                )
            );

            if(!$oResult){
                $wpdb->print_error();
                return false;
            }

            for($i = 0; $i < 3; $i++){
                $this->__copyFiles($this->_szPluginDir ."-". $i .".jpg");
            }
            $this->__copyFiles($this->_szPluginDir ."-icon.png");

            return true;
        }

        public function onShowSettings(){

            $page = filter_input(INPUT_GET, 'sub');

            switch($page){
                case "install":{
                    $this->onInstallDbData();
                }break;
            }

            ?>

            <div class="ctl-arcade-wrapper">
                <?php
                    if ( !current_user_can( 'manage_options' ) )  {
                        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
                    }

                ?>
                <h1><?php echo $this->_szPluginName; ?></h1>



                <?php
                    if( is_plugin_inactive("ctl-arcade/ctl-arcade.php") ){
                        ?>
                        <h2>Attention</h2>
                        <p>In order to use the game, you have to install and enable the <strong>CTL Arcade
                                Plugin</strong> first.</p>
                        <p>You can buy it from this url: <a target="_blank" href="http://codecanyon.net/user/codethislab/portfolio/?ref=codethislab">http://codecanyon.net/user/codethislab/portfolio</a></p>
                        <p>This game is compatible with <strong>CTL Arcade Plugin ver <?php echo $this->_szCompatibleArcadeVersion; ?>
                                .</strong></p>
                    <?php
                    }else if( !$this->__checkArcadePluginVersion() ){
                        ?>
                        <h1>Attention</h1>
                        <p>This game is compatible with <strong>CTL Arcade Plugin ver <?php echo $this->_szCompatibleArcadeVersion; ?>.</strong></p>

                        <p>In order to use the game, you have to install the compatible <strong>CTL Arcade Plugin</strong>, or
                            vice versa.</p>
                        <p>You can buy it from this url: <a target="_blank" href="http://codecanyon.net/user/codethislab/portfolio/?ref=codethislab">http://codecanyon.net/user/codethislab/portfolio</a></p>

                    <?php
                    }else if(!$this->__checkDbData()){
                        $this->onInstallDbData();
                        ?>
                        <script>
                            window.top.location = "<?php echo admin_url() .
                        "admin.php?page=ctl_arcade_page_manage_games&game=" . $this->_szPluginDir; ?>";
                        </script>
                    <?php
                    }else{
                        ?>
                        <p>Go to the <a href="<?php echo admin_url(); ?>admin.php?page=ctl_arcade_page_manage_games&game=<?php echo $this->_szPluginDir; ?>">plugin page</a> to edit game settings for CTL Arcade Plugin</p>
                    <?php
                    }
                ?>
            </div>
        <?php
        }

        public function onSetActivationRedirect(){
            add_option($this->_szPluginDir . '_do_activation_redirect', true);
        }

        public function onActivationRedirect() {
            if (get_option($this->_szPluginDir . '_do_activation_redirect', false)) {
                delete_option($this->_szPluginDir . '_do_activation_redirect');

                if(!isset($_GET['activate-multi']) &&
                    is_admin() &&
                    is_plugin_active($this->_szPluginDir . "/" .
                        $this->_szPluginDir . ".php") &&
                    filter_input(INPUT_GET, 'action') != "deactivate") {
                    wp_redirect(admin_url() .
                        "admin.php?page=ctl_arcade_page_manage_games&game=" .
                        $this->_szPluginDir );
                }
            }
        }

        public function onAddActionLinks ( $links ) {
            $mylinks = array(
                '<a href="' . admin_url() .
                'admin.php?page=ctl_arcade_page_manage_games&game='.
                $this->_szPluginDir .'">Settings</a>',
            );
            return array_merge( $mylinks, $links );
        }
    }

    $g_oCTLArcadeSlotMrChicken =  new CTLArcadeSlotMrChicken();
