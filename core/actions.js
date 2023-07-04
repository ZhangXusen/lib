const download = require("download-git-repo");
function createProject(project) {
	//增加其他功能
	program
		.command("create <project> [...others]")
		.description("创建项目，如zxscli create my-project")
		.action(function (project) {
			console.log("创建了一个项目:", project);
			//从github clone项目模板
			download(
				"direct:https://github.com/coderwhy/vue3_template.git#main",
				project,
				{
					clone: true,
				},
				(err) => {
					console.log("创建项目失败");
				}
			);
		});
}

module.exports = { createProject };
