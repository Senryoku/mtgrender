<template>
	<div class="progress">
		<div v-for="(task, idx) in tasks" :key="idx" class="task">
			<div class="task-name">
				<span v-if="task.status === 'success'" class="success">✓ </span>
				<span v-else-if="task.status === 'fail'" class="fail">✗ </span>
				<Spinner v-else /><span>{{ task.name }}</span>
			</div>
			<div v-for="(step, step_idx) in task.steps" :key="step_idx" class="step">
				<span v-if="step.status === 'success'" class="success">✓</span>
				<span v-else-if="step.status === 'fail'" class="fail">✗</span>
				<Spinner v-else />
				<span v-if="step.progress">{{ step.progress }}</span>
				<span>{{ step.name }}</span>
			</div>
			<div v-if="task.message" class="message" :class="task.message.type">
				{{ task.message.text }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Spinner from "./Spinner.vue";
export default {
	props: { defaulttasks: Array },
	components: { Spinner },
	data(inst) {
		return {
			tasks: inst.$props.defaulttasks ?? [],
		};
	},
	methods: {
		get_tasks() {
			return this.tasks;
		},
		push_task(task) {
			if (typeof task === "string") task = { name: task };
			if (!task.steps) task.steps = [];
			this.tasks.push(task);
		},
		push_step(step) {
			if (typeof step === "string") step = { name: step };
			this.last_task.steps.push(step);
		},
		update_step(progress) {
			const task = this.last_task;
			task.steps[task.steps.length - 1].progress = progress;
		},
		end_step() {
			this.last_step.status = "success";
		},
		fail_step() {
			this.last_step.status = "fail";
		},
		end_task(message) {
			this.end_step();
			this.last_task.status = "success";
			if (message) this.last_task.message = { type: "success", text: message };
		},
		fail_task(message) {
			this.fail_step();
			this.last_task.status = "fail";
			if (message) this.last_task.message = { type: "error", text: message };
		},
	},
	computed: {
		last_task() {
			return this.tasks[this.tasks.length - 1];
		},
		last_step() {
			return this.last_task?.steps?.[this.last_task?.steps?.length - 1];
		},
	},
};
</script>

<style scoped>
.progress {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

.task {
	box-shadow: 2px 2px 10px #0006;
	padding: 0.5em;
	border-radius: 0.5em;
}

.task-name {
	display: flex;
	gap: 1em;
	font-size: 1.5em;
	margin: 0.5em;
}

.step {
	display: flex;
	justify-content: space-between;
}

.success {
	color: green;
}

.fail,
.error {
	color: red;
}

.message {
	background-color: #0002;
	padding: 0.2em 0.5em;
	border-radius: 0.2em;
	margin: 1em;
}
</style>