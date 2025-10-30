class VoiceService {
    constructor() {
        this.currentAudio = null;
        this.settings = {
            rate: 0.8,
            pitch: 1.1,
            volume: 0.9
        };
        this.availableVoices = [];
        this.selectedVoice = null;
        
        this.loadSettings();
        this.initVoices();
        
        console.log('语音服务初始化完成 - 使用浏览器内置TTS');
    }

    // 初始化语音列表
    initVoices() {
        if (speechSynthesis.getVoices().length > 0) {
            this.loadVoices();
        } else {
            // 等待语音列表加载
            speechSynthesis.addEventListener('voiceschanged', () => {
                this.loadVoices();
            });
        }
    }

    loadVoices() {
        this.availableVoices = speechSynthesis.getVoices();
        const chineseVoices = this.availableVoices.filter(voice => 
            voice.lang.includes('zh') || voice.lang.includes('CN')
        );
        
        console.log('找到中文语音:', chineseVoices.map(v => v.name));
        
        // 选择最佳语音
        const voicePriority = [
            voice => voice.name.includes('Ting-Ting'),
            voice => voice.name.includes('Mei-Jia'), 
            voice => voice.name.includes('Google'),
            voice => voice.name.includes('Microsoft'),
            voice => voice.name.includes('Female')
        ];
        
        for (const preference of voicePriority) {
            this.selectedVoice = chineseVoices.find(preference);
            if (this.selectedVoice) {
                console.log('选择语音:', this.selectedVoice.name);
                break;
            }
        }
        
        if (!this.selectedVoice && chineseVoices.length > 0) {
            this.selectedVoice = chineseVoices[0];
            console.log('使用默认语音:', this.selectedVoice.name);
        }
    }

    // 语音合成
    async synthesize(text) {
        return this.browserTTS(text);
    }

    browserTTS(text) {
        if (!('speechSynthesis' in window)) {
            console.error('浏览器不支持语音合成');
            return false;
        }

        // 停止当前语音
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = this.settings.rate;
        utterance.pitch = this.settings.pitch;
        utterance.volume = this.settings.volume;
        
        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        }
        
        // 添加事件监听
        utterance.onstart = () => console.log('🔊 语音播放开始');
        utterance.onend = () => console.log('✅ 语音播放结束');
        utterance.onerror = (event) => {
            console.error('❌ 语音播放错误:', event);
            // 语音播放失败时不阻塞其他功能
        };
        
        try {
            speechSynthesis.speak(utterance);
            return true;
        } catch (error) {
            console.error('语音合成异常:', error);
            return false;
        }
    }

    // 设置管理
    loadSettings() {
        const savedSettings = localStorage.getItem('voiceSettings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                this.updateSettingsUI();
            } catch (e) {
                console.error('加载语音设置失败:', e);
            }
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('voiceSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error('保存语音设置失败:', e);
        }
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    updateSettingsUI() {
        const rateSlider = document.getElementById('voice-rate');
        const pitchSlider = document.getElementById('voice-pitch');
        const volumeSlider = document.getElementById('voice-volume');
        const rateValue = document.getElementById('rate-value');
        const pitchValue = document.getElementById('pitch-value');
        const volumeValue = document.getElementById('volume-value');

        if (rateSlider) rateSlider.value = this.settings.rate;
        if (rateValue) rateValue.textContent = this.settings.rate;
        if (pitchSlider) pitchSlider.value = this.settings.pitch;
        if (pitchValue) pitchValue.textContent = this.settings.pitch;
        if (volumeSlider) volumeSlider.value = this.settings.volume;
        if (volumeValue) volumeValue.textContent = this.settings.volume;
    }

    stop() {
        speechSynthesis.cancel();
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }
}