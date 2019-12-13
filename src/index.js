import ko from 'knockout';
import init from './init';
import componentFactory from './componentFactory';

ko.bindingHandlers.cssComponent = {
    init,
    componentFactory,
    componentStore: {},
};