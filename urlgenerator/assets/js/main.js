const app = Vue.createApp({
    data() {
        return {
            data,
        }
    },
    methods: {
        getDate(time) {
            return new Date(time);
        },
        getDateDetail(time) {
            const _date = this.getDate(time);
            return {
                year: _date.getFullYear() || '',
                month: _date.getMonth() + 1 || '',
                date: _date.getDate() || ''
            }
        },
        getDiff(startDate, endDate) {
            return ( this.getDate(endDate) - this.getDate(startDate) ) / (1000 * 60 * 60 * 24);
        },
        changeDiff(_timeItem) {
            _timeItem.time.diff = this.getDiff(_timeItem.time.start, _timeItem.time.end) + 1 || 0;
        },
        formatToYYMMDD(time) {
            const _date = this.getDateDetail(time);
            return _date.year
                + '-' 
                + this.padNumToTwo(_date.month)
                + '-' 
                + this.padNumToTwo(_date.date);
        },
        changeEndDate(timeItem) {
            const _start = this.getDate(timeItem.time.start);
            const _end = this.addDay(_start, timeItem.time.diff - 1);
            timeItem.time.end = _end;
        },
        addDay(date, addAmount) {
            const _date = this.getDate(date);
            return ( this.formatToYYMMDD(_date.setDate(_date.getDate() + addAmount)) );
        },
        addNPN() {
            const _NPNItem = {
                id: this.data.editedStatus.NPNList.length,
                name: '',
                time: {
                    start: '',
                    end: '',
                    period: null,
                    inputLimit: null
                }
            };
            this.data.editedStatus.NPNList.push(_NPNItem);
        },
        rmNPN(idx) {
            this.data.editedStatus.NPNList.splice(idx, 1);
        },
        rmAllNPN() {
            this.data.editedStatus.NPNList.length = 0;
        },
        generateResult() {
            this.data.editedStatus.LPN.periods = this.getLPNPeriods(this.data.editedStatus.NPNList);

            const _LPNClone = this.getDeepClone(this.data.editedStatus.LPN);
            const _NPNClone = this.getDeepClone(this.data.editedStatus.NPNList);

            const _curEditedData = this.data.page.types[this.data.editedStatus.type].output;

            if (this.isUpdatedStatus()) {
                if (this.data.editedStatus.NPNList.length === 0) {
                    _curEditedData.LPNList.splice(this.data.editedStatus.idx, 1);
                    _curEditedData.NPNList.splice(this.data.editedStatus.idx, 1);
                } else {
                    _curEditedData.LPNList[this.data.editedStatus.idx] = _LPNClone;
                    _curEditedData.NPNList[this.data.editedStatus.idx] = _NPNClone;   
                };
            } else {
                _curEditedData.LPNList.push(_LPNClone);
                _curEditedData.NPNList.push(_NPNClone);
            };
        },
        sortNPN() {
            if (this.isEmptyNPNList())
            return;
            this.data.editedStatus.NPNList.sort((a, b) => 
                this.getDate(a.time.start) - this.getDate(b.time.start)
                    || this.getDate(a.time.end) - this.getDate(b.time.end)
            );
        },
        setNPNDateUseActiv() {
            if (this.hasEmptyValue('.config--activ')
                || this.isEmptyNPNList())
            return;
            this.data.activ.times.forEach((_time, _idx) => {
                if (!this.data.editedStatus.NPNList?.[_idx])
                return;
                this.data.editedStatus.NPNList[_idx].time.start = _time.time.start;
                this.data.editedStatus.NPNList[_idx].time.end = _time.time.end;
            });
            this.setInputLimit();
            this.setEditedNPNPeriod();
        },
        setNPNNameUseLPN() {
            if (this.isEmptyNPNList())
            return;
            this.data.editedStatus.NPNList.forEach(_NPNItem => {
                if (_NPNItem.name)
                return;
                _NPNItem.name = this.data.editedStatus.LPN.name;
            });
        },
        setInputLimit() {
            for (const _NPNItem of this.data.editedStatus.NPNList) {
                for (const [_idx, _activTime] of this.data.activ.times.entries()) {
                    if (this.isTimeInPeriod(_NPNItem.time.start, _activTime.time)) {
                        _NPNItem.time.inputLimit = _idx;
                        break;
                    } else {
                        _NPNItem.time.inputLimit = null;
                    };
                };
            };
        },
        getPeriod(NPNItem) {
            let _period;
            for (const [_idx, _activTime] of this.data.activ.times.entries()) {
                if (this.isTimeInPeriod(NPNItem.time.start, _activTime.time) 
                    && this.isTimeInPeriod(NPNItem.time.end, _activTime.time)
                        && this.getDate(NPNItem.time.start) <= this.getDate(NPNItem.time.end)) {
                    _period = _idx;
                    break;
                } else {
                    _period = null;
                };
            };
            return _period;
        },
        setEditedNPNPeriod() {
            for (const _NPNItem of this.data.editedStatus.NPNList) {
                _NPNItem.time.period = this.getPeriod(_NPNItem);
            };
        },
        updateOutputPeriod() {
            hasOutputTypes = Object.values(this.data.page.types)
                .filter(type => type.output.LPNList.length !== 0 && type.output.NPNList.length !== 0);
            for(const _type of hasOutputTypes) {
                for(const [_idx, _NPNSection] of _type.output.NPNList.entries()) {
                    for(const _NPNItem of _NPNSection) {
                        _NPNItem.time.period = this.getPeriod(_NPNItem);
                    };
                    _type.output.LPNList[_idx].periods = this.getLPNPeriods(_NPNSection);
                };
            };
        },
        getLPNPeriods(NPNSection) {
            const _NPNPeriods = NPNSection.map(_NPNItem => _NPNItem.time.period);
            return [...new Set(_NPNPeriods)];
        },
        getAlphabet(idx) {
            return String.fromCharCode(idx + 65);
        },
        hasEmptyValue(checkRange) {
            let hasEmptyValue = false;
            for (const input of document.querySelector(checkRange).querySelectorAll('input[required]')) {
                if (!input.value || input.value.length === 0) {
                    this.invalidPrompt(input);
                    hasEmptyValue = true;
                };
            }
            return hasEmptyValue;
        },
        hasInvalidActivTime() {
            let hasInvalidTime = false;
            const checkTarget = document.querySelectorAll('.activ-time input[type=number]');
            for(const input of checkTarget) {
                if (input.value <= 0) {
                    this.invalidPrompt(input);
                    hasInvalidTime = true;
                    break;
                }
            }
            return hasInvalidTime;
        },
        hasInvalidPeriod() {
            let hasInvalidTime = false;
            const checkTarget = document.querySelectorAll('.NPN-edited-wrapper li');
            this.data.editedStatus.NPNList.forEach((_NPNItem, _idx) => {
                if (_NPNItem.time.period === null) {
                    checkTarget[_idx].querySelectorAll('input[type=date]')
                            .forEach(input => {
                                this.invalidPrompt(input);
                            })
                    hasInvalidTime = true;
                };
            });
            return hasInvalidTime;
        },
        isTimeInPeriod(time, { start, end }) {
            const _time = this.getDate(time);
            const _periodStart = this.getDate(start);
            const _periodEnd = this.getDate(end);
            return _periodStart <= _time && _time <= _periodEnd;
        },
        isEmptyNPNList() {
            let isEmptyNPNList = false;
            const checkTarget = document.querySelector('.NPN-edited-wrapper');
            if (this.data.editedStatus.NPNList.length === 0) {
                this.invalidPrompt(checkTarget);
                isEmptyNPNList = true;
            }
            return isEmptyNPNList;
        },
        isInvalidForm() {
            return this.hasEmptyValue('form')
                    || ( !this.isUpdatedStatus() && this.isEmptyNPNList() )
                        || this.hasInvalidActivTime()
                            || this.hasInvalidPeriod();
        },
        isUpdatedStatus() {
            return this.data.editedStatus.idx !== null;
        },
        submit() {
            if (this.isInvalidForm())
            return;
            this.sortNPN();
            this.generateResult();
            this.clearEdit();
            this.addNPN();
        },
        copyOutput(event) {
            const r = document.createRange();
            r.selectNode(document.querySelector('.output'));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(r);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            this.copiedPrompt(event);
        },
        getDeepClone(data) {
            return JSON.parse(JSON.stringify(data));
        },
        edit(event) {
            const [_type, _idx] = event.currentTarget.dataset.section.split('-');
            this.data.editedStatus.type = _type;
            this.data.editedStatus.idx = +_idx;
            this.data.editedStatus.LPN = this.getDeepClone(this.data.page.types[_type].output.LPNList[_idx]);
            const _NPNList = this.getDeepClone(this.data.page.types[_type].output.NPNList[_idx]);
            this.data.editedStatus.NPNList = _NPNList;
            this.setInputLimit();
        },
        clearEdit() {
            this.data.editedStatus.LPN.name = '';
            this.data.editedStatus.LPN.period = '';
            this.data.editedStatus.NPNList = [];
            this.data.editedStatus.idx = null;
        },
        cancelUpdate() {
            this.clearEdit();
            this.addNPN();
        },
        copiedPrompt(event) {
            event.target.classList.add('isCopied');
            event.target.addEventListener('transitionend', () => {
                event.target.classList.remove('isCopied');
            });
        },
        invalidPrompt(element) {
            element.classList.add('invalid');
            element.addEventListener('transitionend', () => { 
                element.classList.remove('invalid');
            });
        },
        padNumToTwo(number) {
            return String(number).padStart(2, 0);
        },
        generateAllResultList() {
            const result = [];
            for(const component of document.querySelectorAll('#componentName')) {
                result.push([component.textContent, component.textContent]);
            }
            for(const _private of document.querySelectorAll('#privateName')) {
                const _privateName = _private.textContent;
                const _activName = this.data.activ.name;
                const _typeName = _private.querySelector('#typeName')?.textContent || '';
                const _NPNName = _private.querySelector('#NPNName')?.textContent.replace('-', '') || '';
                const _arr = [`${_activName}-${_typeName}${!_NPNName ? '' : ('-' + _NPNName)}`, _privateName];
                result.push(_arr)
            }
            console.log(result);
        },
    },
    computed: {
        activTitle() {
            const activTimes = this.data.activ.times;

            this.data.activ.year = this.getDateDetail(activTimes[1].time.start).year;
            this.data.activ.month = 
                this.padNumToTwo(this.getDateDetail(activTimes[1].time.start).month)
            let _string = 
                `短促URL總表【${ this.data.activ.year } ${ this.data.activ.month }月-${ this.data.activ.name }】`;
            activTimes.forEach(activTime => {
                if (!activTime.time.start) return;
                const startTime = this.getDateDetail(activTime.time.start);
                const endTime = this.getDateDetail(activTime.time.end);
                _string += 
                    `${activTime.name + startTime.month}/${startTime.date}-${endTime.month}/${endTime.date} `
            });
            return _string;
        },
    },
    mounted() {
        this.addNPN();
    },
}).mount('#app');