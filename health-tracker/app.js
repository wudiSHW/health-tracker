// 数据存储
const Storage = {
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getTodayKey(prefix) {
        const today = new Date().toISOString().split('T')[0];
        return `${prefix}_${today}`;
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    loadTodayData();
    updateStats();
    loadReminders();
    requestNotificationPermission();
    
    // 每分钟检查一次提醒
    setInterval(checkReminders, 60000);
    
    // 显示安装提示
    setTimeout(showInstallPrompt, 2000);
});

// 更新当前日期
function updateCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('zh-CN', options);
}

// 切换标签页
function switchTab(tabName) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的标签
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.classList.remove('active');
        if ((tabName === 'record' && index === 0) ||
            (tabName === 'reminder' && index === 1) ||
            (tabName === 'stats' && index === 2)) {
            item.classList.add('active');
        }
    });
    
    // 如果切换到统计页，更新统计数据
    if (tabName === 'stats') {
        updateStats();
    }
}

// 保存血压记录
function saveBloodPressure(timeOfDay) {
    const highInput = document.getElementById(`bp${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}High`);
    const lowInput = document.getElementById(`bp${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}Low`);
    
    const high = parseInt(highInput.value);
    const low = parseInt(lowInput.value);
    
    if (!high || !low) {
        showNotification('请输入完整的血压数值', 'error');
        return;
    }
    
    if (high < 50 || high > 250 || low < 30 || low > 150) {
        showNotification('血压数值超出正常范围，请检查', 'error');
        return;
    }
    
    const key = Storage.getTodayKey('bloodPressure');
    const data = Storage.get(key) || {};
    
    data[timeOfDay] = {
        high: high,
        low: low,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    
    Storage.set(key, data);
    
    // 清空输入
    highInput.value = '';
    lowInput.value = '';
    
    showNotification(`${getTimeLabel(timeOfDay)}血压记录成功！`, 'success');
    loadTodayData();
    updateStats();
}

// 保存吃药记录
function saveMedication(timeOfDay) {
    const checkbox = document.getElementById(`med${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`);
    const key = Storage.getTodayKey('medication');
    const data = Storage.get(key) || {};
    
    data[timeOfDay] = {
        taken: checkbox.checked,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    
    Storage.set(key, data);
    
    if (checkbox.checked) {
        showNotification(`${getTimeLabel(timeOfDay)}服药记录成功！`, 'success');
    }
    
    loadTodayData();
    updateStats();
}

// 保存运动记录
function saveExercise() {
    const typeSelect = document.getElementById('exerciseType');
    const durationInput = document.getElementById('exerciseDuration');
    
    const type = typeSelect.value;
    const duration = parseInt(durationInput.value);
    
    if (!type || !duration) {
        showNotification('请选择运动类型并输入时长', 'error');
        return;
    }
    
    const key = Storage.getTodayKey('exercise');
    const data = Storage.get(key) || [];
    
    data.push({
        type: type,
        duration: duration,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
    
    Storage.set(key, data);
    
    // 清空输入
    typeSelect.value = '';
    durationInput.value = '';
    
    showNotification('运动记录成功！', 'success');
    loadTodayData();
    updateStats();
}

// 加载今日数据
function loadTodayData() {
    // 加载血压记录
    const bpData = Storage.get(Storage.getTodayKey('bloodPressure')) || {};
    const bpRecordsDiv = document.getElementById('bpRecords');
    bpRecordsDiv.innerHTML = '';
    
    ['morning', 'noon', 'evening'].forEach(time => {
        if (bpData[time]) {
            const record = document.createElement('div');
            record.className = 'record-item';
            record.innerHTML = `
                <div class="record-info">
                    <div class="record-value">${bpData[time].high}/${bpData[time].low} mmHg</div>
                    <div class="record-time">${getTimeLabel(time)} ${bpData[time].time}</div>
                </div>
                <button class="btn btn-danger" onclick="deleteRecord('bloodPressure', '${time}')">删除</button>
            `;
            bpRecordsDiv.appendChild(record);
        }
    });
    
    // 加载吃药记录
    const medData = Storage.get(Storage.getTodayKey('medication')) || {};
    ['morning', 'noon', 'evening'].forEach(time => {
        const checkbox = document.getElementById(`med${time.charAt(0).toUpperCase() + time.slice(1)}`);
        if (medData[time]) {
            checkbox.checked = medData[time].taken;
        }
    });
    
    const medRecordsDiv = document.getElementById('medRecords');
    medRecordsDiv.innerHTML = '';
    ['morning', 'noon', 'evening'].forEach(time => {
        if (medData[time] && medData[time].taken) {
            const record = document.createElement('div');
            record.className = 'record-item';
            record.innerHTML = `
                <div class="record-info">
                    <div class="record-value">✅ 已服药</div>
                    <div class="record-time">${getTimeLabel(time)} ${medData[time].time}</div>
                </div>
            `;
            medRecordsDiv.appendChild(record);
        }
    });
    
    // 加载运动记录
    const exerciseData = Storage.get(Storage.getTodayKey('exercise')) || [];
    const exerciseRecordsDiv = document.getElementById('exerciseRecords');
    exerciseRecordsDiv.innerHTML = '';
    
    exerciseData.forEach((item, index) => {
        const record = document.createElement('div');
        record.className = 'record-item';
        record.innerHTML = `
            <div class="record-info">
                <div class="record-value">${item.type} ${item.duration}分钟</div>
                <div class="record-time">${item.time}</div>
            </div>
            <button class="btn btn-danger" onclick="deleteExerciseRecord(${index})">删除</button>
        `;
        exerciseRecordsDiv.appendChild(record);
    });
}

// 删除记录
function deleteRecord(type, timeOfDay) {
    const key = Storage.getTodayKey(type);
    const data = Storage.get(key) || {};
    delete data[timeOfDay];
    Storage.set(key, data);
    loadTodayData();
    updateStats();
    showNotification('记录已删除', 'success');
}

// 删除运动记录
function deleteExerciseRecord(index) {
    const key = Storage.getTodayKey('exercise');
    const data = Storage.get(key) || [];
    data.splice(index, 1);
    Storage.set(key, data);
    loadTodayData();
    updateStats();
    showNotification('记录已删除', 'success');
}

// 更新统计数据
function updateStats() {
    const bpData = Storage.get(Storage.getTodayKey('bloodPressure')) || {};
    const bpCount = Object.keys(bpData).length;
    document.getElementById('bpCount').textContent = bpCount;
    
    const medData = Storage.get(Storage.getTodayKey('medication')) || {};
    const medCount = Object.values(medData).filter(m => m.taken).length;
    document.getElementById('medCount').textContent = medCount;
    
    const exerciseData = Storage.get(Storage.getTodayKey('exercise')) || [];
    document.getElementById('exerciseCount').textContent = exerciseData.length;
    
    const totalMinutes = exerciseData.reduce((sum, item) => sum + item.duration, 0);
    document.getElementById('exerciseMinutes').textContent = totalMinutes;
}

// 设置提醒
function setReminder(type) {
    const timeInput = document.getElementById(`${type}ReminderTime`);
    const time = timeInput.value;
    
    if (!time) {
        showNotification('请选择提醒时间', 'error');
        return;
    }
    
    const reminders = Storage.get('reminders') || {};
    reminders[type] = {
        time: time,
        enabled: true
    };
    Storage.set('reminders', reminders);
    
    showNotification('提醒设置成功！', 'success');
    loadReminders();
    scheduleNotification(type, time);
}

// 加载提醒设置
function loadReminders() {
    const reminders = Storage.get('reminders') || {};
    const container = document.getElementById('activeReminders');
    container.innerHTML = '';
    
    const typeNames = {
        bloodPressure: '🩺 血压测量',
        medication: '💊 吃药',
        exercise: '🏃 运动'
    };
    
    Object.entries(reminders).forEach(([type, setting]) => {
        if (setting.enabled) {
            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `
                <div>
                    <div style="font-weight: bold;">${typeNames[type]}</div>
                    <div class="reminder-time">${setting.time}</div>
                </div>
                <button class="btn btn-danger" onclick="cancelReminder('${type}')">取消</button>
            `;
            container.appendChild(item);
        }
    });
}

// 取消提醒
function cancelReminder(type) {
    const reminders = Storage.get('reminders') || {};
    if (reminders[type]) {
        reminders[type].enabled = false;
        Storage.set('reminders', reminders);
        loadReminders();
        showNotification('提醒已取消', 'success');
    }
}

// 请求通知权限
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// 检查提醒
function checkReminders() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const reminders = Storage.get('reminders') || {};
    const typeNames = {
        bloodPressure: '🩺 该测血压了',
        medication: '💊 该吃药了',
        exercise: '🏃 该运动了'
    };
    
    Object.entries(reminders).forEach(([type, setting]) => {
        if (setting.enabled && setting.time === currentTime) {
            showNotification(typeNames[type], 'reminder');
            
            // 发送系统通知
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('健康记录助手', {
                    body: typeNames[type],
                    icon: 'icon-192x192.png',
                    badge: 'icon-192x192.png',
                    tag: type,
                    requireInteraction: true
                });
            }
        }
    });
}

// 安排通知
function scheduleNotification(type, time) {
    // 这里使用简单的定时检查，实际应用中可以使用更精确的定时机制
    console.log(`已设置 ${type} 提醒在 ${time}`);
}

// 导出到Excel
function exportToExcel() {
    const today = new Date().toISOString().split('T')[0];
    const bpData = Storage.get(Storage.getTodayKey('bloodPressure')) || {};
    const medData = Storage.get(Storage.getTodayKey('medication')) || {};
    const exerciseData = Storage.get(Storage.getTodayKey('exercise')) || [];
    
    let csvContent = '时间,类型,数值/状态,备注\n';
    
    // 血压数据
    ['morning', 'noon', 'evening'].forEach(time => {
        if (bpData[time]) {
            csvContent += `${today} ${bpData[time].time},${getTimeLabel(time)}血压,"${bpData[time].high}/${bpData[time].low} mmHg",\n`;
        }
    });
    
    // 吃药数据
    ['morning', 'noon', 'evening'].forEach(time => {
        if (medData[time] && medData[time].taken) {
            csvContent += `${today} ${medData[time].time},${getTimeLabel(time)}服药,已完成,\n`;
        }
    });
    
    // 运动数据
    exerciseData.forEach(item => {
        csvContent += `${today} ${item.time},运动,"${item.type} ${item.duration}分钟",\n`;
    });
    
    // 下载CSV文件
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `健康记录_${today}.csv`;
    link.click();
    
    showNotification('数据已导出！', 'success');
}

// 显示历史记录
function showHistory() {
    const history = [];
    
    // 获取最近7天的数据
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const bpData = Storage.get(`bloodPressure_${dateStr}`) || {};
        const medData = Storage.get(`medication_${dateStr}`) || {};
        const exerciseData = Storage.get(`exercise_${dateStr}`) || [];
        
        if (Object.keys(bpData).length > 0 || Object.keys(medData).length > 0 || exerciseData.length > 0) {
            history.push({
                date: dateStr,
                bp: bpData,
                med: medData,
                exercise: exerciseData
            });
        }
    }
    
    if (history.length === 0) {
        showNotification('暂无历史记录', 'error');
        return;
    }
    
    // 创建历史记录弹窗
    let html = '<div style="max-height: 400px; overflow-y: auto;">';
    history.forEach(day => {
        html += `<div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">`;
        html += `<h3 style="color: #667eea; margin-bottom: 10px;">${day.date}</h3>`;
        
        if (Object.keys(day.bp).length > 0) {
            html += `<div style="margin-bottom: 8px;"><strong>血压:</strong> `;
            Object.entries(day.bp).forEach(([time, data]) => {
                html += `${getTimeLabel(time)} ${data.high}/${data.low}mmHg; `;
            });
            html += `</div>`;
        }
        
        const medCount = Object.values(day.med).filter(m => m.taken).length;
        if (medCount > 0) {
            html += `<div style="margin-bottom: 8px;"><strong>服药:</strong> ${medCount}次</div>`;
        }
        
        if (day.exercise.length > 0) {
            html += `<div><strong>运动:</strong> `;
            day.exercise.forEach(ex => {
                html += `${ex.type} ${ex.duration}分钟; `;
            });
            html += `</div>`;
        }
        
        html += `</div>`;
    });
    html += '</div>';
    
    // 显示弹窗
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-title">📋 历史记录</div>
            ${html}
            <button class="btn" onclick="this.closest('.modal').remove()" style="margin-top: 20px; background: #f5f5f5; color: #333;">关闭</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// 显示通知
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideDown 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#4CAF50';
    } else if (type === 'error') {
        notification.style.background = '#f44336';
    } else if (type === 'reminder') {
        notification.style.background = '#ff9800';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 获取时间标签
function getTimeLabel(time) {
    const labels = {
        morning: '🌅 早晨',
        noon: '☀️ 中午',
        evening: '🌙 晚上'
    };
    return labels[time] || time;
}

// PWA安装相关
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function showInstallPrompt() {
    if (deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
        document.getElementById('installModal').classList.add('active');
    }
}

function closeInstallModal() {
    document.getElementById('installModal').classList.remove('active');
}

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            showNotification('应用安装成功！', 'success');
        }
        deferredPrompt = null;
    }
    closeInstallModal();
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(style);
