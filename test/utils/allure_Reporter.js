var events = require ('events');
var util = require('util');
var config_l = require('../config');
var Allure = require ('allure-js-commons');
var Step = require  ('allure-js-commons/beans/step');
var step_name = require('./info_steps');
var path = require ('path');
var fs = require('fs');
var mkdirp = require('mkdirp')

//Подправленный мной wdio-allure-reporter, сырая версия

function isEmpty (object) {
    return !object || Object.keys(object).length === 0
}

const LOGGING_HOOKS = ['"before all" hook', '"after all" hook'];
const LOGGING_HOOKS_NAMES = {

   '"before all" hook':"Preconditions (suite setup)",
   '"after all" hook': "Postconditions"
}

class allure_Reporter extends events.EventEmitter {
    constructor (baseReporter, config, options = {}) {
        super()

        this.baseReporter = baseReporter
        this.config = config
        this.options = options
            this.t_pass = 0
    this.t_fail = 0
    this.t_pend = 0
    this.date = ''
    this.date_options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    };

        this.build_url = process.env.BUILD_URL
        this.allures = {}

        const { epilogue } = this.baseReporter


    this.on('start', function() {
        this.date = new Date();
    });
        


        this.on('end', (end) => {




            var result = '/-> Всего тестов: ' + (this.t_pass + this.t_fail + this.t_pend)  + ' (FAILED: ' + this.t_fail  + ', PASSED: ' + this.t_pass  + ', PENDING: ' + this.t_pend +')'
            //file += '\n' + 'Всего тестов: ' + (this.t_pass + this.t_fail + this.t_pend) + '\n' + 'FAILED: ' + this.t_fail + '\n' + 'PASSED: ' + this.t_pass + '\n' + 'PENDING: ' + this.t_pend
            //file += '\n' + 'Где: ' + config_l.host
            //file += '\n' + 'Когда: ' + this.date.toLocaleString("ru", this.date_options)

            const dir = path.resolve('./mini-results')
            const filename = 'mini-results.txt'
            const filepath = path.join(dir, filename)
            mkdirp.sync(dir)

            if (fs.existsSync(filepath)) {
                try {

                var file = JSON.parse (fs.readFileSync(filepath, 'utf8'));
                file.browsers.push({'browser':this.config.browser,'result': result});
                file.time = this.date.toLocaleString("ru", this.date_options);


            }
                catch (e) {

                    console.log(e)
                    }

            }
            else {
                var  file = {
                'BUILD_URL': this.build_url,
                'browsers' : [],
                'time' : this.date.toLocaleString("ru", this.date_options), 
        }
                file.browsers.push({'browser':this.config.browser,'result': result})

            }


            fs.writeFileSync(filepath, JSON.stringify(file))

            console.log('-------------')
            console.log(file)
            console.log('-------------')



            epilogue.call(baseReporter)
        })

        this.on('suite:start', (suite) => {
            const allure = this.getAllure(suite.cid)
            const currentSuite = allure.getCurrentSuite()
            const prefix = currentSuite ? currentSuite.name + ' ' : ''
            allure.startSuite(prefix + suite.title + '('+ suite.runner[suite.cid].browserName + ')')
        })

        this.on('suite:end', (suite) => {

            const allure = this.getAllure(suite.cid);

            allure.endSuite()
        })

        this.on('test:start', (test) => {
            const allure = this.getAllure(test.cid)
            allure.startCase(test.title)

            const currentTest = allure.getCurrentTest()
            currentTest.addParameter('environment-variable', 'capabilities', JSON.stringify(test.runner[test.cid]))
            currentTest.addParameter('environment-variable', 'spec files', JSON.stringify(test.specs))
        })

        this.on('test:pass', (test) => {
            this.getAllure(test.cid).endCase('passed')
            this.t_pass += 1;
        })

        this.on('test:fail', (test) => {
            const allure = this.getAllure(test.cid)
            const status = test.err.type === 'AssertionError' ? 'failed' : 'broken'

            if (!allure.getCurrentTest()) {
                allure.startCase(test.title)
            } else {

                if (LOGGING_HOOKS.indexOf(test.title) === -1) {
                allure.getCurrentTest().name = test.title
            }

            }

            while (allure.getCurrentSuite().currentStep instanceof Step) {
                allure.endStep(status)
            }

            allure.endCase(status, test.err)
            this.t_fail += 1;
        })

        this.on('test:pending', (test) => {
            this.getAllure(test.cid).pendingCase(test.title)
            this.t_pend += 1;
        })


        this.on('runner:beforecommand', (com) => {
            const allure = this.getAllure(com.cid); 

            if (!this.isAnyTestRunning(allure) || !(LOGGING_HOOKS.indexOf(allure.getCurrentTest().title)) === -1) {
                return
            }

            console.log(step_name(com));
            allure.startStep(step_name(com));

})

        this.on('runner:aftercommand', (com) => {
            const allure = this.getAllure(com.cid);
            if (!this.isAnyTestRunning(allure)) {
                return
            }

            allure.endStep('passed');
})

        this.on('runner:command', (command) => {

            const allure = this.getAllure(command.cid);

            if (!this.isAnyTestRunning(allure) || !(LOGGING_HOOKS.indexOf(allure.getCurrentTest().title)) === -1) {
                return
            }

            //console.log('---------->' + `${command.method} ${command.uri.path}`);

            allure.startStep(`${command.method} ${command.uri.path}`)

           if (!isEmpty(command.data)) {
                this.dumpJSON(allure, 'Request', command.data)
            }

        })

        this.on('runner:result', (command) => {

            const allure = this.getAllure(command.cid)


            if (!this.isAnyTestRunning(allure) || !(LOGGING_HOOKS.indexOf(allure.getCurrentTest().title)) === -1) {
                return
            }

            if (command.requestOptions.uri.path.match(/\/wd\/hub\/session\/[^/]*\/screenshot/)) {
                allure.addAttachment('Screenshot', new Buffer(command.body.value, 'base64'))
            } else {
                this.dumpJSON(allure, 'Response', command.body)
            }
            allure.endStep('passed')
        })

       this.on('hook:start', (hook) => {
            const allure = this.getAllure(hook.cid)

            if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
                return
            }

            allure.startCase(LOGGING_HOOKS_NAMES[hook.title])
        })

        this.on('hook:end', (hook) => {
            const allure = this.getAllure(hook.cid)

            if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
                return
            }

            allure.endCase('passed')
            this.t_pass += 1;
            if (allure.getCurrentTest().steps.length === 0) {
                allure.getCurrentSuite().testcases.pop();
                this.t_pass -= 1;
            }
        }) 
    }

    getAllure (cid) {
        if (this.allures[cid]) {
            return this.allures[cid]
        }

        const allure = new Allure()
        allure.setOptions({ targetDir: this.options.outputDir || 'allure-results' })
        this.allures[cid] = allure
        return this.allures[cid]
    }

    isAnyTestRunning (allure) {
        return allure.getCurrentSuite() && allure.getCurrentTest()
    }

    dumpJSON (allure, name, json) {
        allure.addAttachment(name, JSON.stringify(json, null, '    '), 'application/json')
    }
}

allure_Reporter.reporterName = 'allure_Reporter';

util.inherits(allure_Reporter, events.EventEmitter);

exports = module.exports = allure_Reporter;