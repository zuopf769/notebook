describe("Ellocate", function() {
    describe(".ellocate", function() {
        it('generates locator for a div element with id', function() {
            var locator = $('div#foo').ellocate();
            expect(locator.xpath).toBe("//html[1]/body[1]/div[@id='ellocate']/div[@id='foo']");
            expect(locator.css).toBe("html > body > div#ellocate > div#foo");
        });
        it('generates locator for a div element with class', function() {
            var locator = $('div.baz').ellocate();
            expect(locator.xpath).toBe("//html[1]/body[1]/div[@id='ellocate']/div[@id='foo']/div[@id='bar']/div[1]");
            expect(locator.css).toBe("html > body > div#ellocate > div#foo > div#bar > div.baz.qux");
        });
        it('generates locator for an li element with class', function() {
            var locator = $('li.baz').ellocate();
            expect(locator.xpath).toBe("//html[1]/body[1]/div[@id='ellocate']/div[@id='foo']/ul[1]/li[1]");
            expect(locator.css).toBe("html > body > div#ellocate > div#foo > ul > li.baz");
        });
        it('generates locator for a nested element', function() {
            var locator = $('div.baz > p').ellocate();
            expect(locator.xpath).toBe("//html[1]/body[1]/div[@id='ellocate']/div[@id='foo']/div[@id='bar']/div[1]/p[1]");
            expect(locator.css).toBe("html > body > div#ellocate > div#foo > div#bar > div.baz.qux > p");
        });
        it('generates locator for a root element', function() {
            var locator = $('html').ellocate();
            expect(locator.xpath).toBe("//html[1]");
            expect(locator.css).toBe("html");
        });
        it('does not duplicate id attributes', function() {
            var locator = $('div#ellocate > div#dupe > div').ellocate();
            expect(locator.xpath).toBe("//html[1]/body[1]/div[@id='ellocate']/div[2]/div[@id='dupe']");
            expect(locator.css).toBe("html > body > div#ellocate > div > div#dupe");
        });
    });
});