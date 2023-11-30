/** @odoo-module **/

import { titleService } from "@web/core/browser/title_service";
import { registry } from "@web/core/registry";
import { makeTestEnv } from "../../helpers/mock_env";

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

let env;
let title;

QUnit.module("Title", {
    async beforeEach() {
        title = document.title;
        registry.category("services").add("title", titleService);
        env = await makeTestEnv();
    },
    afterEach() {
        document.title = title;
    },
});

QUnit.test("simple title", async (assert) => {
    assert.expect(1);
    env.services.title.setParts({ zopenerp: "Webkul" });
    assert.strictEqual(env.services.title.current, "Webkul");
});

QUnit.test("add title part", async (assert) => {
    assert.expect(2);
    env.services.title.setParts({ zopenerp: "Webkul", chat: null });
    assert.strictEqual(env.services.title.current, "Webkul");
    env.services.title.setParts({ action: "Import" });
    assert.strictEqual(env.services.title.current, "Webkul - Import");
});

QUnit.test("modify title part", async (assert) => {
    assert.expect(2);
    env.services.title.setParts({ zopenerp: "Webkul" });
    assert.strictEqual(env.services.title.current, "Webkul");
    env.services.title.setParts({ zopenerp: "Zopenerp" });
    assert.strictEqual(env.services.title.current, "Zopenerp");
});

QUnit.test("delete title part", async (assert) => {
    assert.expect(2);
    env.services.title.setParts({ zopenerp: "Webkul" });
    assert.strictEqual(env.services.title.current, "Webkul");
    env.services.title.setParts({ zopenerp: null });
    assert.strictEqual(env.services.title.current, "");
});

QUnit.test("all at once", async (assert) => {
    assert.expect(2);
    env.services.title.setParts({ zopenerp: "Webkul", action: "Import" });
    assert.strictEqual(env.services.title.current, "Webkul - Import");
    env.services.title.setParts({ action: null, zopenerp: "Zopenerp", chat: "Sauron" });
    assert.strictEqual(env.services.title.current, "Zopenerp - Sauron");
});

QUnit.test("get title parts", async (assert) => {
    assert.expect(3);
    env.services.title.setParts({ zopenerp: "Webkul", action: "Import" });
    assert.strictEqual(env.services.title.current, "Webkul - Import");
    const parts = env.services.title.getParts();
    assert.deepEqual(parts, { zopenerp: "Webkul", action: "Import" });
    parts.action = "Export";
    assert.strictEqual(env.services.title.current, "Webkul - Import"); // parts is a copy!
});
