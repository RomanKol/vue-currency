
// Currency input component
Vue.component('currency-input', {
    props: [
        'symbol',
        'value',
        'rate',
    ],
    template: `
<div>
  <div class='input-group'>
    <input type='number' min='0' placeholder='0' v-model='valued' @keyup='calculate' @focus='select'>
    <span>{{ symbol }}</span>
  </div>
  <small>Rate: {{ rate | limitDecimals }} {{ symbol }}</small>
</div>
`,
    computed: {
        valued() {
            return this.value.toFixed(2);
        },
    },
    methods: {
        calculate(e) {
            this.$emit('calculate', e.target.value);
        },
        select(e) {
            e.target.select();
        },
    },
    filters: {
        limitDecimals(value, limit = 4) {
            return value.toFixed(limit);
        },
    },
});

// EUR - USD currency calculator
const calculator = new Vue({
    el: '#currency-one',
    data: {
        dollar: 0,
        dollarRate: 0,
        euro: 0,
        euroRate: 0,
        loaded: false,
    },
    created() {
        fetch('http://api.fixer.io/latest')
            .then(response => response.json())
            .then((data) => {
                this.dollarRate = data.rates.USD;
                this.euroRate = 1 / data.rates.USD;
                this.loaded = true;
            })
            .catch((err) => {
                console.log(err);
            });
    },
    methods: {
        calculateDollar(value) {
            this.dollar = parseFloat((value * this.dollarRate).toFixed(2));
        },
        calculateEuro(value) {
            this.euro = parseFloat((value * this.euroRate).toFixed(2));
        },
    },
});

// Currency input
const CurrencyInput = {
    props: {
        value: Number,
        currency: String,
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    template: `
    <div class='input-group mb'>
        <input type='number' min='0' placeholder='0' v-model='valued' :disabled='disabled' @keyup='calculate'>
        <span>{{ currency }}</span>
    </div>
    `,
    computed: {
        valued() {
            return this.value;
        },
    },
    methods: {
        calculate(e) {
            this.$emit('calculate', parseFloat(e.target.value, 10));
        },
    },
};

// Currency dropdown
const CurrencyDropdown = {
    props: [
        'rates',
        'toggled',
    ],
    template: `
    <div class='input-group mb'>
    <select @change='change'>
        <option v-for='rate in rates' :value='rate'>{{ toggled ? 'EUR - ' + rate : rate + ' - EUR' }}</option>
    </select>
    </div>
    `,
    methods: {
        change(e) {
            this.$emit('change', e.target.value);
        },
    },
};

// EUR - Whatever currency calculator
const calculator2 = new Vue({
    el: '#currency-two',
    data: {
        loaded: false,
        from: 0,
        to: 0,
        selectedCurrency: '',
        rates: {},
        currencies: [],
        toggled: true,
    },
    components: {
        cinput: CurrencyInput,
        cdropdown: CurrencyDropdown,
    },
    methods: {
        calculate(value) {
            this.from = value;
            this.to = parseFloat((value * this.rate).toFixed(2));
        },
        changeCurrency(currency) {
            this.selectedCurrency = currency;
            this.calculate(this.from);
        },
        toggle() {
            const from = this.from;
            this.from = this.to;
            this.to = from;
        },
    },
    computed: {
        rate() {
            return this.toggled ? this.rates[this.selectedCurrency] || 0 : 1 / this.rates[this.selectedCurrency] || 0;
        },
    },
    filters: {
        toFixed(value, limit = 4) {
            return parseFloat(value.toFixed(limit), 10);
        },
    },
    beforeCreate() {
        fetch('http://api.fixer.io/latest')
            .then(response => response.json())
            .then((data) => {
                this.rates = data.rates;
                this.loaded = true;
                this.currencies = Object.keys(this.rates);
                this.selectedCurrency = this.currencies[0];
            })
            .catch((err) => {
                console.log(err);
            });
    },
});
