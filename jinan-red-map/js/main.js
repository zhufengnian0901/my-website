document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('intro-video');
    const videoContainer = document.getElementById('intro-video-container');
    const mapContainer = document.getElementById('map-container');
    const skipButton = document.getElementById('skip-button');
    
    let redMap;
    let videoPlayed = false;
    let mapInitialized = false;

    console.log('页面加载完成，开始初始化...');

    // 确保视频可以播放
    video.addEventListener('canplay', function() {
        console.log('视频可以播放');
    });

    video.addEventListener('error', function(e) {
        console.log('视频加载失败:', e);
        // 如果视频加载失败，直接进入地图
        skipToMap();
    });

    video.addEventListener('loadeddata', function() {
        console.log('视频数据已加载');
        // 尝试自动播放，如果失败显示播放按钮
        video.play().catch(function(error) {
            console.log('自动播放被阻止:', error);
            showPlayButton();
        });
    });

    // 视频结束事件 - 修复这里
    video.addEventListener('ended', function() {
        console.log('视频播放结束，准备切换到地图');
        skipToMap();
    });

    // 跳过按钮事件
    skipButton.addEventListener('click', function() {
        console.log('用户点击跳过');
        skipToMap();
    });

    // 点击视频容器也可以跳过
    videoContainer.addEventListener('click', function(e) {
        if (e.target !== skipButton) {
            console.log('用户点击视频区域跳过');
            skipToMap();
        }
    });

    function showPlayButton() {
        const playButton = document.createElement('div');
        playButton.id = 'play-button';
        playButton.innerHTML = '点击播放视频';
        playButton.style.position = 'absolute';
        playButton.style.top = '50%';
        playButton.style.left = '50%';
        playButton.style.transform = 'translate(-50%, -50%)';
        playButton.style.color = 'white';
        playButton.style.background = 'rgba(0,0,0,0.7)';
        playButton.style.padding = '15px 30px';
        playButton.style.borderRadius = '25px';
        playButton.style.cursor = 'pointer';
        playButton.style.fontSize = '18px';
        playButton.style.zIndex = '1001';
        
        playButton.addEventListener('click', function() {
            console.log('用户点击播放按钮');
            video.play();
            playButton.remove();
        });
        
        videoContainer.appendChild(playButton);
    }

    function skipToMap() {
        if (videoPlayed) {
            console.log('skipToMap 已被调用过，跳过');
            return;
        }
        videoPlayed = true;
        
        console.log('开始切换到地图...');
        
        videoContainer.style.opacity = '0';
        videoContainer.style.transition = 'opacity 0.5s ease';
        
        setTimeout(function() {
            console.log('隐藏视频容器，显示地图容器');
            videoContainer.style.display = 'none';
            mapContainer.style.display = 'block';
            
            // 初始化地图 - 确保只初始化一次
            if (!mapInitialized) {
                console.log('开始初始化地图...');
                try {
                    redMap = new RedMap();
                    redMap.init();
                    mapInitialized = true;
                    console.log('地图初始化成功');
                    
                    // 开始背景音乐
                    setTimeout(() => {
                        console.log('开始背景音乐');
                        redMap.startBackgroundMusic();
                    }, 1000);
                } catch (error) {
                    console.error('地图初始化失败:', error);
                    // 如果地图初始化失败，显示错误信息
                    alert('地图加载失败，请刷新页面重试');
                }
            }
        }, 500);
    }

    // 如果10秒后视频还没开始，直接跳过
    setTimeout(function() {
        if (!videoPlayed) {
            console.log('视频加载超时（10秒），直接进入地图');
            skipToMap();
        }
    }, 10000);

    // 额外的安全措施：监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && !videoPlayed) {
            console.log('页面被隐藏，直接进入地图');
            skipToMap();
        }
    });
});