function helpOptions() {
	//处理--version
	const version = require("../../package.json").version;
	program.version(version, "-v --version");
	//增加其他option操作
	program.option("-z --zxs <arg>", "fuck you bitch，this is zxs!"); //(命令<参数>，命令描述)
	//commander解析argv参数
	program.parse(process.argv);
	// 获取命令参数arg
	console.log(program.opts().arg);

	//监听命令
	program.on("--help", () => {
		console.log("\n");
	});
}
module.exports = helpOptions;
